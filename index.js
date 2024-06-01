import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';
import jsonfile from 'jsonfile';

const { writeFile } = jsonfile;
const FILE_PATH = './data.json';

const git = simpleGit();

const makeCommit = async n => {
    if (n === 0) {
        await git.push('origin', 'main', { '--set-upstream': true });
        return;
    }
    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const DATE = moment().subtract(1, 'y').add(x, 'w').add(y, 'd').format();
    const data = { date: DATE };

    console.log(data);

    writeFile(FILE_PATH, data, async () => {
        await git.add(FILE_PATH);
        await git.commit(DATE, { '--date': DATE });
        makeCommit(--n);
    });
};

const initializeAndRun = async () => {
    // Initialize the repository if it is not already initialized
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
        await git.init();
        await git.addRemote('origin', 'https://github.com/BlueSpicySpace/BlueSpicySpace.git');
    }
    // Check if the current branch has an upstream branch set
    const branches = await git.branch(['-vv']);
    if (!branches.all.includes('main')) {
        await git.checkoutLocalBranch('main');
    }

    makeCommit(500);
};

initializeAndRun();

