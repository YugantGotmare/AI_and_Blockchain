const express = require('express')
const axios=require('axios')
const {utils}=require('ethers')
const createCsvWriter=require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config()

const app=express()
const apiKey=process.env.API_KEY
class Block{
    constructor(timeStamp,blockReward){
        this.timeStamp=timeStamp;
        this.blockReward=blockReward;
    }
}

// Function to read existing CSV file
const readExistingData = () => {
    return new Promise((resolve, reject) => {
      const existingData = [];
      fs.createReadStream('block_data.csv')
        .pipe(csv())
        .on('data', (row) => {
          existingData.push(row);
        })
        .on('end', () => {
          resolve(existingData);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  };
  

const fetchData = async () => {
    try {
      const existingData = await readExistingData();
      const listOfBlocks = existingData.slice(); // Create a copy of existing data
  
      let blockNumber = 17469523;
  
      while (listOfBlocks.length < 500) {
        const apiUrl = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
  
        if (response.data.result && response.data.result.blockReward) {
          const rewardEther = utils.formatEther(response.data.result.blockReward);
          const timeStamp = response.data.result.timeStamp;
          const block = new Block(timeStamp, rewardEther);
  
          // Check for duplicate entries
          if (!isDuplicate(block, listOfBlocks)) {
            listOfBlocks.push(block);
          }
        }
  
        blockNumber++;
      }
  
      exportToCsv(listOfBlocks);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Function to check for duplicate entries
const isDuplicate = (block, listOfBlocks) => {
    for (let i = 0; i < listOfBlocks.length; i++) {
      if (
        block.timeStamp === listOfBlocks[i].timeStamp &&
        block.blockReward === listOfBlocks[i].blockReward
      ) {
        return true;
      }
    }
    return false;
  };
  

const exportToCsv = (data) => {
    console.log("Hello")
    const csvWriter = createCsvWriter({
      path: 'new_block_data.csv',
      header: [
        { id: 'timeStamp', title: 'timestamp' },
        { id: 'blockReward', title: 'blockReward' }
      ]
    });
  
    csvWriter
      .writeRecords(data)
      .then(() => {
        console.log('CSV file created successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

(async()=>{
    try{
        await fetchData()
        app.listen(3000,()=>{
            console.log("Server is running");
        })
    }catch(erorr){
        console.error(error)
    }
})()