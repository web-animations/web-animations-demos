# Copyright 2013 Google Inc. All rights reserved.
# Use of this source code is governed by the Apache license that can be
# found in the LICENSE file.

"""Presubmit checks for Web Animation Demos."""

import subprocess
from git_cl import Changelist
import tempfile
import os


RETURN_SUCCESS = 0


def _CheckJSLint(input_api, output_api):
  intern_projects = ['breakout', 'walking']
  for directory in intern_projects:
    source_dir = input_api.os_path.join(input_api.PresubmitLocalPath(), directory)
    return_code = subprocess.call(['gjslint', '-r', source_dir])
    if return_code != RETURN_SUCCESS:
      return [output_api.PresubmitError(
          'Javascript style check failed.\n'
          'Style guide: http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml')]
  return []


def _CheckRemoteIsOrigin(input_api, output_api):
  try:
    branch = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD']).strip()
    remote = subprocess.check_output(['git', 'config', 'branch.%s.remote' % branch]).strip()
    if remote != 'origin':
      set_remote = raw_input('Remote (%s) should be set to \'origin\', set it now? [y/n]: ' % remote).lower()
      if set_remote.startswith('y'):
        subprocess.call(['git', 'config', 'branch.%s.remote' % branch, 'origin'])
      else:
        return [output_api.PresubmitError('Remote must be set to \'origin\' to push to Github.')]
  except:
    return [output_api.PresubmitError('Unable to validate remote for branch, is your local git branch misconfigured?')]
  return []


def _WriteTemporaryFile(data):
  f = tempfile.NamedTemporaryFile('w')
  f.write(data)
  f.flush()
  os.fsync(f)
  return f


def _CheckLocalBranchMatchesPatchset(input_api, output_api):
  issue = input_api.change.issue
  cl = Changelist(issue=issue)
  patch_set = cl.GetMostRecentPatchset()

  patch_set_diff = cl.GetPatchSetDiff(issue, patch_set)
  local_diff = subprocess.check_output(['git', 'diff', 'origin/master']);

  with _WriteTemporaryFile(patch_set_diff) as patch_set_diff_file:
    with _WriteTemporaryFile(local_diff) as local_diff_file:
      diff_diff = subprocess.check_output(['interdiff', patch_set_diff_file.name, local_diff_file.name])

  if diff_diff:
    return [output_api.PresubmitError('Local branch does not match patch set %s for issue %s. Revert or upload new changes to branch to resolve.\n\n%s' % (patch_set, issue, diff_diff))]
  return []


def CheckChangeOnUpload(input_api, output_api):
  return _CheckJSLint(input_api, output_api)


def CheckChangeOnCommit(input_api, output_api):
  results = []
  results.extend(_CheckJSLint(input_api, output_api))
  results.extend(input_api.canned_checks.CheckChangeWasUploaded(input_api, output_api))
  results.extend(input_api.canned_checks.CheckChangeHasDescription(input_api, output_api))
  results.extend(input_api.canned_checks.CheckOwners(input_api, output_api))
  results.extend(_CheckRemoteIsOrigin(input_api, output_api))
  results.extend(_CheckLocalBranchMatchesPatchset(input_api, output_api))
  return results
