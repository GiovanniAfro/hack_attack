const fs = require('fs');
const spawn = require("child_process").spawn;

console.log("epico")

function superSpawn(command, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args);
        process.on('exit', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Process exited with code ${code}`));
        });
        process.on('error', (err) => reject(err));
    });
}

async function epicRecursive(origin, options, q, compare) {
    let tomix = origin;
    if (compare > 8)
        return;
    if (q & compare) {
        if (q & (compare - 1)) {
            tomix = "mix.wav";
        }
        try {
            await superSpawn('python3',["test.py", options[Math.log2(compare)], tomix]);
            await epicRecursive(tomix, options, q, compare * 2);
        } catch (err) {
            console.log(err);
            reject(err);
        }
        return;
    }
    await epicRecursive(tomix, options, q, compare * 2);
}

async function removeNoise(origin, q) {

    let options = ["samples/checco_burger.wav", "samples/angel_investor.wav", "samples/super_sayan4.wav", "samples/ahegao.wav"];
    await epicRecursive(origin, options, q, 1)
    .then(() => {
        console.log("super done");
    })
    .catch((err) => {
        console.log(err);
    });
}

if (process.argv.length < 4) {
    console.log("Usage: node prototype.js <origin> <q>");
    return;
}

removeNoise(process.argv[2], process.argv[3]);
