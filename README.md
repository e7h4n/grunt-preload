# grunt-preload

Parse @preload tag to concat other files in javascript.

## Getting Started
This is an internal task set used by [fenbi.com], read each source before use it.

Install the module with: `npm install grunt-preload`

```javascript
grunt.initConfig({
    preload: {
        test: {
            files: 'test/src/*.js'
        }
    }
});

grunt.loadNpmTasks('grunt-preload');
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History

`0.1.2` 2012-12-26 Fix: missing dependency `underscore`.
`0.1.0` 2012-12-10 First release.

## License
Copyright (c) 2012 PerfectWorks  
Licensed under the MIT license.

[fenbi.com]: http://fenbi.com
