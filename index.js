// index.js
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';
import jsonfile from 'jsonfile';

const FILE_PATH = './data.json';
const git = simpleGit();

// Function to make a commit
const makeCommit = async n => {
    if (n === 0) {
        await git.push('origin', 'main', { '--set-upstream': true });
        return;
    }
    const x = random.int(0, 54);  // Weeks in a year
    const y = random.int(0, 6);   // Days in a week
    const DATE = moment().subtract(1, 'y').add(x, 'w').add(y, 'd').format();
    const data = { date: DATE };

    console.log(`Committing on: ${DATE}`);  // Log commit date for debugging

    jsonfile.writeFile(FILE_PATH, data, async () => {
        await git.add(FILE_PATH);
        await git.commit(DATE, { '--date': DATE });
        makeCommit(--n);
    });
};

// Initialize and run the script
const initializeAndRun = async () => {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
        await git.init();
        await git.addRemote('origin', 'https://github.com/BlueSpicySpace/BlueSpicySpace.git');
    }

    const branches = await git.branch(['-vv']);
    if (!branches.all.includes('main')) {
        await git.checkoutLocalBranch('main');
    }

    makeCommit(500);  // Number of commits
};

initializeAndRun();
