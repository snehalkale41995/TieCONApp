import React from 'react';
import { TouchableHighlight, View, ScrollView, Image, Platform, StyleSheet, Alert } from 'react-native';
import {NavigationActions} from 'react-navigation';
import { RkStyleSheet, RkText, RkTheme } from 'react-native-ui-kitten';
import {MainRoutes} from '../../config/navigation/routes';
import firebase from '../../config/firebase';
import {FontAwesome, FontIcons} from '../../assets/icons';

export class SideMenu extends React.Component {

  constructor(props) {
    super(props);
    this._navigateAction = this._navigate.bind(this);
  }

  _navigate(route) {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: route.id})
      ]
    });
    this.props.navigation.dispatch(resetAction)
  }

  _renderIcon() {
    if (RkTheme.current.name === 'light')
      return <Image style={styles.icon} source={require('../../assets/images/smallLogo.png')}/>;
    return <Image style={styles.icon} source={require('../../assets/images/smallLogoDark.png')}/>

  }

  _onLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Yes', onPress: () => {
            firebase.auth().signOut().then(function() {
              // Sign-out successful.
            }).catch(function(error) {
              // An error happened.
            });
          } 
        },
        { text: 'No', onPress: () => {} },
      ],
      { cancellable: false }
    );
  }

  render() {
    let menu = MainRoutes.map((route, index) => {
      return (
        <TouchableHighlight
          style={styles.container}
          key={route.id}
          underlayColor={RkTheme.current.colors.button.underlay}
          activeOpacity={1}
          onPress={() => this._navigateAction(route)}>
          <View style={styles.content}>
            <View style={styles.content}>
              <RkText style={styles.icon}
                      rkType='moon primary xlarge'>{route.icon}</RkText>
              <RkText>{route.title}</RkText>
            </View>
            <RkText rkType='awesome secondaryColor small'>{FontAwesome.chevronRight}</RkText>
          </View>
        </TouchableHighlight>
      )
    });

    return (
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={[styles.container, styles.content]}>
            {this._renderIcon()}
            <RkText rkType='logo'>TiECON</RkText>
          </View>
          {menu}
          

          <TouchableHighlight
            style={styles.container}
            key={'Logout'}
            underlayColor={RkTheme.current.colors.button.underlay}
            activeOpacity={1}
            onPress={ this._onLogout.bind(this) }>
            <View style={styles.content}>
              <View style={styles.content}>
                <RkText style={styles.icon}
                        rkType='moon primary xlarge'>{FontIcons.login}</RkText>
                <RkText>Logout</RkText>
              </View>
              <RkText rkType='awesome secondaryColor small'>{FontAwesome.chevronRight}</RkText>
            </View>
          </TouchableHighlight>


        </ScrollView>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    height: 80,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base
  },
  root: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: theme.colors.screen.base
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginRight: 13,
  }
}));