import fs from "fs";
import {stringify} from "csv-stringify";
import {parse} from "csv-parse";
const filename = "users_data.csv";
const columns = [
    "id",
    "firstName",
    "lastName",
    "email",
    "marketingConsent",
    "accesstoken",
  ];

/**
 * 
 * @returns array of objects reprsenting the DB inserts
 */
export async function ReadData()
{
    const dataArray = [];
    return new Promise((resolve,reject)=>{
        fs.createReadStream(filename)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            // console.log(row);
            const user = {
                id:row[0],
                firstName: row[1],
                lastName: row[2],
                email: row[3],
                marketingConsent: row[4],
                token: row[5]
            }
            dataArray.push(user);             

        })
        .on("end", function () {
            // console.log("finished reading data");
            resolve(dataArray);
        })
        .on("error", function (error) {
            console.log(error.message);
            reject(error.message);
        });
    })
}


/**
 * 
 * @output resolves if writes are done. rejects if error occurs
 */
export async function WriteData(data)
{
    return new Promise((resolve,reject)=>{
        try {
            const writableStream = fs.createWriteStream(filename,{flags: 'a'});
            const stringifier = stringify({ header: false, columns: columns });
            //data to write here
            stringifier.write(data);
            stringifier.pipe(writableStream);
            // console.log("Finished writing data");
            resolve();
        } catch (error) {
            reject(error.message);
        }
    })

}