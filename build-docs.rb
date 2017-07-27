#!/usr/bin/env ruby

require "English"

def system_req(*args)
  system(*args)
  if $CHILD_STATUS.exitstatus != 0
    raise "Failed to run '#{args}'"
  end
end

system_req 'nodenv update-version-defs'
system_req 'nodenv install || :'
Dir.chdir "docs" do
  system_req 'yarn'
  system_req 'yarn run build-prod'
end
