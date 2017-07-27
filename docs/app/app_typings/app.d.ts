declare interface RmConfig {
  getEnvironment: () => 'development' | 'production';
}

declare const rmConfig : RmConfig
