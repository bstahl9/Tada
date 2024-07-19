import {AppRegistry} from 'react-native';
import App from './src/app/App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player'
import { PlaybackService } from './src/constants/service'

AppRegistry.registerComponent(appName, () => App); // register app
TrackPlayer.registerPlaybackService(() => PlaybackService); // register track player