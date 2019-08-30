<p align="center">
<img src="http://armstrongcss.org/assets/logolarge.svg" width="256" height="256" />
</p>

# armstrong-react
Armstrong React - [Rocketmakers](http://www.rocketmakers.com/) React component library.

## 5.0 Breaking changes

Coming soon!


## 2.0 Breaking changes
Armstrong 2.0 is a performance related upgrade which cleans up a lot of things that I've been meaning to
get round to for a while now.

### Library upgrades
Every dependency is now at it's latest version as of 21/04/17. This hopefully won't cause issues, but
it's here just so you know.


### Imports
Your main import for armstrong is now core rather than style as below:

Before ```@import "~armstrong-react/dist/style";```

After ``` @import "~armstrong-react/dist/core";```

### Icon usage
If you want to use an icon on any element, your component must import ```Icon``` and you then use ```Icon.icomoon.rocket``` for example rather than the previous ```Button.icomoon.rocket```.


