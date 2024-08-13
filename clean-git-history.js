import simpleGit from 'simple-git';

const git = simpleGit();

async function cleanGitHistory() {
  try {
    // Check if there are any changes to stash
    const status = await git.status();
    let stashed = false;

    if (status.files.length > 0) {
      // Stash any unstaged changes
      const stashResult = await git.stash();
      if (stashResult.includes('No local changes to save')) {
        stashed = false;
      } else {
        stashed = true;
      }
    }

    // Remove .env and netlify.toml files from history
    await git.raw(['filter-branch', '--force', '--index-filter', 'git rm --cached --ignore-unmatch .env netlify.toml recaptcha.js', '--prune-empty', '--tag-name-filter', 'cat', '--', '--all']);
    
    // Clean up the repository
    await git.raw(['reflog', 'expire', '--expire=now', '--all']);
    await git.raw(['gc', '--prune=now', '--aggressive']);
    
    // Apply stashed changes if any were stashed
    if (stashed) {
      await git.stash(['pop']);
    }
    
    console.log('Successfully cleaned .env and netlify.toml files from Git history.');
  } catch (err) {
    console.error('Error cleaning Git history:', err);
  }
}

cleanGitHistory();