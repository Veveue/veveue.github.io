const fs = require("fs");
const https = require("https");

const fileName = `wakatime.md`;
const str1 = fs.readFileSync(fileName, "utf8");

function apiKeyBase64(apiKey) {
    const apiKeyBuffer = Buffer.from(apiKey);
    return apiKeyBuffer.toString("base64");
}

function request(apiKey, path) {
    const options = {
        port: 443,
        hostname: "wakatime.com",
        path: `/api/v1${path}`,
        method: "GET",
        headers: {
            Authorization: `Basic ${apiKeyBase64(apiKey)}`,
        },
    };
    return new Promise((resolve, reject) => {
        let responseBody = "";
        const req = https.request(options, res => {
            res.on("data", data => {
                responseBody += data;
            });

            res.on("end", () => {
                try {
                    const bodyJSON = JSON.parse(responseBody);
                    resolve(bodyJSON);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.end();
    });
}

const requestObj = apiKey => ({
    last7Days: () => request(apiKey, "/users/current/stats/last_7_days"),
    last30Days: () => request(apiKey, "/users/current/stats/last_30_days"),
    last6Months: () => request(apiKey, "/users/current/stats/last_6_months"),
    lastYear: () => request(apiKey, "/users/current/stats/last_year"),
    summaries: (start, end) => request(apiKey, `/users/current/summaries?start=${start}&end=${end}`),
    currentUser: () => request(apiKey, "/users/current"),
});

const keys = [
    {
        key: "362feac5-3d8b-4b88-95f5-db0d6cf92d18",
        name: "veveue",
    },
];
function getEndDate() {
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const year = new Date().getFullYear();
    function makeZero(value) {
        return value > 9 ? value : `0${value}`;
    }
    return `${year}-${makeZero(month)}-${makeZero(day)}`;
}
fs.writeFile(
    fileName,
    // eslint-disable-next-line max-len
    `${str1} \n\n\n\n | --------------------------------- 统计时间 ${getEndDate()} --------------------------------- \n\n | 姓名       | 时长          | \n  | ---------- | ------------- | `,
    err => {
        if (err) {
            return console.log(err);
        }
    }
);
async function main() {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // eslint-disable-next-line no-await-in-loop
        const data = await requestObj(key.key).summaries(getEndDate(),getEndDate());
        const str = fs.readFileSync(fileName, "utf8");
        fs.writeFile(
            fileName,
            `${str} \n | ${key.name}  |  ${(data.data && data.data[0].grand_total.text.replace("hrs", "时").replace("mins", "分")) || 0} |`,
            err => {
                if (err) {
                    return console.log(err);
                }
            }
        );
    }
}

main().catch(console.error);
