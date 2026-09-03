const fs = require('fs');
const path = require('path');
const https = require('https');

const models = [
  {
    name: 'RobotExpressive.glb',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb'
  },
  {
    name: 'Soldier.glb',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Soldier.glb'
  },
  {
    name: 'Xbot.glb',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Xbot.glb'
  },
  {
    name: 'Ybot.glb',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Ybot.glb'
  }
];

const targetDir = path.join(__dirname, '..', 'src', 'assets', 'avatars3d');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function run() {
  console.log('Downloading 3D Avatars...');
  for (const model of models) {
    const dest = path.join(targetDir, model.name);
    console.log(`Downloading ${model.name}...`);
    try {
      await downloadFile(model.url, dest);
      console.log(`Successfully downloaded ${model.name}`);
    } catch (err) {
      console.error(`Error downloading ${model.name}:`, err.message);
    }
  }
  console.log('Done!');
}

run();
