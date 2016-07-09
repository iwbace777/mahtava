# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'arvor'
set :repo_url, 'git@github.com:matthewashby/arvor.git'
set :deploy_to, '/var/www/arvor'
set :scm, :git
set :format, :pretty
set :log_level, :debug

set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/uploads')
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

set :rvm_type, :system
set :rvm_ruby_version, '2.2.3'
set :rails_env, 'production'

# Default value for keep_releases is 5
set :keep_releases, 3

set :passenger_in_gemfile, true
set :passenger_roles, :app
set :passenger_restart_with_sudo, true
set :passenger_restart_command, 'bundle exec passenger-config restart-app'
set :passenger_restart_options, -> { "#{deploy_to} --ignore-app-not-running" }
