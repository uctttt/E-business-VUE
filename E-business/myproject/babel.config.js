module.exports = {
        "presets": [
            "@vue/cli-plugin-babel/preset"
        ],
        "plugins": [
            [
                "component",
                {
                    "libraryName": "element-ui",
                    "styleLibraryName": "theme-chalk"
                }
            ]
        ]
    }
    // babel用途：JS转换，ES6转ES5