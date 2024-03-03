import Twilio from "twilio";
import User from "../models/user.model.js";
import {ApiError} from  "./apiError.js"


// calculate the days difference and returns days in Number format
function daysBetween(dateStr) {

    let dateObj;
    try {
        dateObj = new Date(dateStr);
    } catch (error) {
        throw new Error("Invalid ISO string format for date.");
    }

    const today = new Date();
    return Math.floor((today - dateObj) / (1000 * 60 * 60 * 24));  // Calculate difference in days
}

function adjustPriority(days) {
    let priority;
    if(days === 0) {
        priority = 0;
    } else if(days >=1 && days <=2) {
        priority = 1;
    } else if(days >=3 && days <=4) {
        priority = 2;
    } else {
        priority = 3;
    }
    return priority;
}

function getDaysGap(inputDate) {
    const inputDateMs = new Date(inputDate).getTime();
  
    // Get current date in milliseconds
    const currentDateMs = new Date().getTime();
    
    // Calculate the difference in milliseconds
    const differenceMs = currentDateMs - inputDateMs;
    
    // Convert milliseconds to days
    const daysDifference = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    
    return daysDifference;
}

function getUserWithHighestGap(inputArray) {
    const userMap = new Map();
    
    // Populate userMap with maximum daysGap for each userID
    inputArray.forEach(obj => {
      const { userID, daysGap } = obj;
      if (!userMap.has(userID) || userMap.get(userID) < daysGap) {
        userMap.set(userID, daysGap);
      }
    });
  
    // Convert userMap to an array of objects
    const resultArray = [];
    userMap.forEach((daysGap, userID) => {
      resultArray.push({ userID, daysGap });
    });
  
    return resultArray;
  }

  function assignPriorityToUser(inputArray) {
    const sortedArray = inputArray.slice().sort((a, b) => b.daysGap - a.daysGap);
  
    let currentPriority = 0;
    let previousDaysGap = sortedArray[0].daysGap;
    
    // Assign priorities based on the sorted order
    const resultArray = sortedArray.map((obj, index) => {
        if (index > 0 && obj.daysGap < previousDaysGap) {
        currentPriority++;
        }
        previousDaysGap = obj.daysGap;
        return { userID: obj.userID, priority: currentPriority };
    });

  return resultArray;
  }

  function insertByPriorityIn2DArray(inputArray) {
    // Initialize a 2D array
    const resultArray = [];
    inputArray.forEach(obj => {
      // Ensure resultArray has enough rows
      while (resultArray.length <= obj.priority) {
        resultArray.push([]);
      }
      // Insert the userID into the corresponding row based on priority
      resultArray[obj.priority].push({
        userID: obj.userID,
        called:false
      });

    });
    return resultArray;
  }  

async function getUserPhoneNumber(userID) {
  const phone = await User.findById(userID).select("-priority");
  return phone.phoneNumber;
}


async function callUser(data) {
  let call = true;
  while(call) {
    let needCall = false;

    for(const d of data) {
      for (const x of d) {
        if(x.called === false) {
            const phoneNumber = await getUserPhoneNumber(x.userID);
            const accountSID = process.env.TWILIO_ACCOUNT_SID;
            const accountToken = process.env.TWILIO_AUTH_TOKEN;
            const client = Twilio(accountSID,accountToken);
            console.log("phone number:",phoneNumber);

            await client.calls.create({
                url: "https://demo.twilio.com/docs/voice.xml",
                to: "+91"+phoneNumber,
                from: "+"+process.env.TWILIO_PHONE_NUMBER,
            }).then((call) => {
                 x.called = true;
                 console.log(`Call SuccessFully made to +91 ${phoneNumber} : ${call}`);
                  for (const key in call) {
                    console.log(`${key}:${call[key]}`);   
                  }
                
            }).catch((error) => {
                needCall = true;
                console.log(new ApiError(200,"failed to make the call",[`error`]));
            })

           
        }
      }
    }
    
   // if every user once received call then terminate the while loop, otherwise continue!.
    if(needCall === false) {
      call = false;
      
    }
  }
}


export {
  
  daysBetween,
  adjustPriority,
  getDaysGap,
  getUserWithHighestGap,
  assignPriorityToUser,
  insertByPriorityIn2DArray,
  callUser
};