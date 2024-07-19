import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { colours } from './colours'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
	headerLargeTitle: true,
	headerLargeStyle: {
		backgroundColor: colours.background,
	},
	headerLargeTitleStyle: {
		color: colours.text,
	},
	headerTintColor: colours.text,
	headerTransparent: true,
	headerBlurEffect: 'prominent',
	headerShadowVisible: false,
}