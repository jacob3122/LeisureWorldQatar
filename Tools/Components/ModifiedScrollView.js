import React from 'react';
import { ScrollView } from 'react-native';

export default class ModifiedScrollView extends React.Component {
    state = {
        source: null,
    };
    init=0;
    
    componentWillUnmount(){
        this.init=1;
    }
    
    scrollTo(xPos,yPos,anim){
        if(this.init===0&&xPos.x==this.props.initPos)
            return
        else if(this.props.initPos!=0&&xPos.x>this.props.initPos)
            xPos.x=this.props.initPos;

        this.init=1;
        this.refs.scrollview.scrollTo(xPos,yPos,true);
    }
    getOffset(){
        if(this.init===1)
        {
            return 0;
        }
        else{
            return(-1*this.props.initPos);
        }
    }
    
    render() {
        return(
            <ScrollView
            ref='scrollview'
            contentContainerStyle={this.props.contentContainerStyle}
            style={[this.props.style,{marginStart:this.getOffset(),zIndex:-1}]}
            onMomentumScrollEnd={this.props.onMomentumScrollEnd}
            pagingEnabled={this.props.pagingEnabled}
            horizontal= {this.props.horizontal}
            vertical= {this.props.vertical}
            scrollEnabled={this.props.scrollEnabled}
            // contentOffset={{x:(this.getOffset()),y:0}}
            decelerationRate={this.props.decelerationRate}
            showsHorizontalScrollIndicator={this.props.showsHorizontalScrollIndicator}
            snapToInterval={this.props.snapToInterval}
            snapToAlignment={this.props.snapToAlignment}
            contentInset={this.props.contentInset}
            >{this.props.children}
            {/* {(this.refs.scrollview!=undefined&&this.init==0)&&this.scrollwithoutAnim()} */}
            </ScrollView>
            )
        }
    }