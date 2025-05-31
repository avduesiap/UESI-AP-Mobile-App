import React, { useEffect, useCallback, useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    StyleSheet,
    Dimensions, 
    ActivityIndicator, 
    Alert, 
    Linking
} from "react-native";
import { connect } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import { bindActionCreators } from "redux";
import { selectSong, setSongType, setSongs, setMagazineType } from '@actions';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent, OtrixLoader
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";
import Pdf from 'react-native-pdf';

function MagazineListScreen(props) {
    const [pdfUrl, setPdfUrl] = useState('');
    const [percentage, setPercentage] = useState(0);

    useFocusEffect(
        useCallback(() => {
            setPdfUrl('https://avduesiap.in/VIDYARDHI_JWALA/VIDYARDHI_JWALA.pdf');
        }, [])
    );

    return (
        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
            {pdfUrl !== '' ? (
                <Pdf
                    trustAllCerts={false}
                    source={{
                        uri: pdfUrl,
                        cache: true
                    }}
                    page={1}
                    scale={1.0}
                    minScale={0.5}
                    maxScale={3.0}
                    renderActivityIndicator={() => (
                        <>
                            <ActivityIndicator size="large" color={Colors().themeColor} />
                            <Text style={{
                                color: Colors().themeColor,
                                fontSize: 20, 
                                fontFamily: Fonts.Font_Reguler
                            }}>
                                {percentage}% Loaded...
                            </Text>
                        </>
                    )}
                    enablePaging={true}
                    onLoadProgress={(percentage) => {
                        setPercentage((percentage * 100).toFixed(0));
                    }}
                    onLoadComplete={() => console.log('PDF loading complete')}
                    onPageChanged={(page, totalPages) => console.log(`${page}/${totalPages}`)}
                    onError={(error) => {
                        console.log(error);
                        Alert.alert('Error', 'Failed to load PDF');
                    }}
                    onPressLink={(link) => Linking.openURL(link)}
                    style={{
                        flex: 1, 
                        width: Dimensions.get('window').width,
                        backgroundColor: Colors().white
                    }}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors().themeColor} />
                    <Text style={styles.loadingText}>Preparing PDF viewer...</Text>
                </View>
            )}
        </View>
    );
}

function mapStateToProps(state) {
    return {
        selectedSong: state.song.selectedSong,
        songType: state.song.songType,
        magazineType: state.song.magazineType
    };
}

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        selectSong,
        setSongs,
        setSongType,
        setMagazineType
    }, dispatch)
);

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 10,
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Reguler,
        color: Colors().text_color
    },
    pdfContainer: {
        flex: 1,
        width: '100%'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MagazineListScreen);