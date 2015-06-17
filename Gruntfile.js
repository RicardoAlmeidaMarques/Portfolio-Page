/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browser-sync');
  // Project configuration.
  grunt.initConfig({
    watch: {
            files: 'public/stylesheets/*.css',
            tasks: ['browserSync']
      },
     browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'public/stylesheets/*.css',
                        'views/*.jade'
                    ]
                },
                options: {
                    proxy: "localhost:3000"  
                }
            }
       }
    
  });

  // Default task(s).
  grunt.registerTask('default', ['browserSync']);

};