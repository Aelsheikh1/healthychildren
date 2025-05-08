const axios = require('axios');
const fs = require('fs');
const path = require('path');

const foods = [
  { id: 1, name: 'تفاح', type: 'healthy', image: 'https://cdn-icons-png.flaticon.com/512/415/415733.png' },
  { id: 2, name: 'برتقال', type: 'healthy', image: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png' },
  { id: 3, name: 'جزر', type: 'healthy', image: 'https://cdn-icons-png.flaticon.com/512/1202/1202125.png' },
  { id: 4, name: 'خيار', type: 'healthy', image: 'https://cdn-icons-png.flaticon.com/512/1202/1202125.png' },
  { id: 5, name: 'طماطم', type: 'healthy', image: 'https://cdn-icons-png.flaticon.com/512/1202/1202125.png' },
  { id: 11, name: 'موز', type: 'healthy', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909761.png' },
  { id: 6, name: 'بيتزا', type: 'unhealthy', image: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png' },
  { id: 7, name: 'شيبس', type: 'unhealthy', image: 'https://cdn-icons-png.flaticon.com/512/2137/2137845.png' },
  { id: 8, name: 'كعكة', type: 'unhealthy', image: 'https://cdn-icons-png.flaticon.com/512/3075/3075908.png' }
];

const downloadImage = async (url, filename) => {
  try {
    const response = await axios({
      url,
      responseType: 'stream'
    });

    const filePath = path.join(__dirname, '../public/images/healthy-food-sorting', `${filename}.png`);
    
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    throw error;
  }
};

const downloadAllImages = async () => {
  for (const food of foods) {
    try {
      await downloadImage(food.image, food.name);
      console.log(`Downloaded ${food.name}`);
    } catch (error) {
      console.error(`Failed to download ${food.name}`);
    }
  }
};

downloadAllImages();
