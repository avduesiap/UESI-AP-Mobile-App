import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixLoader, OtirxBackButton, CategoryView
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { CategorySkeleton } from '@skeleton';
import { _roundDimensions } from '@helpers/util'
import getApi from "@apis/getApi";
import Fonts from "@helpers/Fonts";
function CategoryScreen(props) {

    const [state, setState] = React.useState({ data: [], loading: true });

    useEffect(() => {

        try {
            const unsubscribe = getApi.getData(
                "getCategories",
                [],
            ).then((response => {
                if (response.status == 1) {
                    setState({
                        ...state,
                        data: response.data,
                        loading: false
                    });
                }
            }));
            return unsubscribe; //unsubscribe

        } catch (error) {

        }

    }, []);

    const { data, loading } = state;
    const { strings } = props;
    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().headerColor }}>
                <TouchableOpacity style={{position:'absolute',top:10,zIndex:9,left:10}} onPress={() => props.navigation.toggleDrawer()}>
                    <OtirxMenuButton />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headingTxt}>Categories</Text>
                </View>
            </OtrixHeader>

            {/* Content Start from here */}
            {
                loading ? <CategorySkeleton /> : <OtrixContent >

                    {/* Category Component Start from here */}
                    <CategoryView navigation={props.navigation} categoriesData={data} />

                </OtrixContent>
            }

        </OtrixContainer >
    )
}


function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings
    }
}


export default connect(mapStateToProps)(CategoryScreen);

const styles = StyleSheet.create({
    headerCenter: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    headingTxt: {
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('4.5%'),
        color: Colors().white
    }
});