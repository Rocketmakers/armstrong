#!/usr/bin/env ruby

require "English"

def system_req(*args)
  system(*args)
  if $CHILD_STATUS.exitstatus != 0
    raise "Failed to run '#{args}'"
  end
end

Dir.chdir "armstrong-react" do
  system_req 'npm publish'
end