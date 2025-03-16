require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { generate: uniqueId } = require('shortid');
const { globSync } = require('glob');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log('✅ MongoDB Connected');
});

async function setupApp() {
  try {
    const Admin = require('../models/coreModels/Admin');
    const AdminPassword = require('../models/coreModels/AdminPassword');
    const Setting = require('../models/coreModels/Setting');
    const PaymentMode = require('../models/appModels/PaymentMode');
    const Taxes = require('../models/appModels/Taxes');

    console.log('⚙️ Setting up Admin...');

    const newAdminPassword = new AdminPassword();
    const salt = uniqueId();
    const passwordHash = newAdminPassword.generateHash(salt, 'admin123');

    const demoAdmin = await new Admin({
      email: 'admin@demo.com',
      name: 'Sapamoving Admin',
      surname: 'Admin',
      enabled: true,
      role: 'owner'
    }).save();

    await new AdminPassword({
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: demoAdmin._id
    }).save();

    console.log('👍 Admin created : Done!');

    console.log('⚙️ Importing settings...');
    const settingFiles = globSync('./src/setup/defaultSettings/**/*.json').flatMap((filePath) => {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });
    await Setting.insertMany(settingFiles);
    console.log('👍 Settings created : Done!');

    console.log('⚙️ Importing Taxes & Payment Modes...');
    await Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);
    await PaymentMode.insertMany([
      {
        name: 'Default Payment',
        description: 'Default Payment Mode (Cash, Wire Transfer)',
        isDefault: true
      }
    ]);
    console.log('👍 Taxes and Payment Modes created: Done!');
    console.log('🥳 Setup completed :Success!');
  } catch (e) {
    console.error('\n🚫 Error during setup:', e);
  }
}

async function importCSVWilayah() {
  try {
    const Wilayah = require('../models/coreModels/Wilayah');
    const results = [];
    const hierarchyMap = {};
    const filePath = path.resolve(__dirname, './defaultSettings/indonesia/wilayah.csv');
    console.log(`📂 Importing Wilayah from: ${filePath}`);
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath);
      process.exit(1);
    }
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          const kodeParts = row.kode.split('.');
          const data = {
            kode: row.kode,
            nama: row.nama,
            provinsi: null,
            kota: null,
            kecamatan: null,
            kelurahan: null
          };

          try {
            if (kodeParts.length === 1) {
              data.provinsi = row.nama;
            } else if (kodeParts.length === 2) {
              data.provinsi = hierarchyMap[kodeParts[0]]?.nama || null;
              data.kota = row.nama;
            } else if (kodeParts.length === 3) {
              data.provinsi = hierarchyMap[kodeParts[0]]?.nama || null;
              data.kota = hierarchyMap[`${kodeParts[0]}.${kodeParts[1]}`]?.nama || null;
              data.kecamatan = row.nama;
            } else if (kodeParts.length === 4) {
              data.provinsi = hierarchyMap[kodeParts[0]]?.nama || null;
              data.kota = hierarchyMap[`${kodeParts[0]}.${kodeParts[1]}`]?.nama || null;
              data.kecamatan = hierarchyMap[`${kodeParts[0]}.${kodeParts[1]}.${kodeParts[2]}`]?.nama || null;
              data.kelurahan = row.nama;
            }

            hierarchyMap[row.kode] = data;
            results.push(data);
          } catch (err) {
            console.error(`⚠️ Error processing row ${row.kode}:`, err);
          }
        })
        .on('end', async () => {
          if (results.length === 0) {
            console.log('⚠️ No data to insert.');
            resolve();
            return;
          }

          try {
            await Wilayah.insertMany(results);
            console.log('👍 Wilayah import completed!');
          } catch (err) {
            console.error('❌ Error inserting Wilayah:', err);
          }

          resolve();
        })
        .on('error', (err) => {
          console.error('❌ Error reading file:', err);
          reject(err);
        });
    });
  } catch (error) {
    console.error('❌ Error during importCSVWilayah:', error);
  }
}

async function main() {
  try {
    await importCSVWilayah();
    await setupApp();
  } catch (error) {
    console.error('❌ Error during execution:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}

main();