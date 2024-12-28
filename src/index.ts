import * as core from '@actions/core';
import simpleGit, { SimpleGit, SimpleGitFactory, TagResult } from 'simple-git';
import { generateNewVersion } from './utils/versionUtils';

async function run() {
    const formatTag = core.getInput('tag_template') || 'yyyy.MM.dd-ii';
    const git: SimpleGit = simpleGit();
    const tags: TagResult = await git.tags();
    const newTag: string = generateNewVersion(formatTag,tags.latest);  
    core.setOutput('new_tag', newTag);
}

run();
