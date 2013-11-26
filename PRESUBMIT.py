# Copyright 2013 Google Inc. All rights reserved.
# Use of this source code is governed by the Apache license that can be
# found in the LICENSE file.

"""Presubmit checks for Web Animation Demos."""

import subprocess


RETURN_SUCCESS = 0


def _CheckJSLint(input_api, output_api):
  source_dir = input_api.os_path.join(input_api.PresubmitLocalPath(), 'demos')
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


def CheckChangeOnUpload(input_api, output_api):
  return _CheckJSLint(input_api, output_api)


def CheckChangeOnCommit(input_api, output_api):
  results = []
  results.extend(_CheckJSLint(input_api, output_api))
  results.extend(input_api.canned_checks.CheckChangeWasUploaded(input_api, output_api))
  results.extend(input_api.canned_checks.CheckChangeHasDescription(input_api, output_api))
  results.extend(input_api.canned_checks.CheckOwners(input_api, output_api))
  results.extend(_CheckRemoteIsOrigin(input_api, output_api))
  return results
