import analytics from '@react-native-firebase/analytics';
import moment from 'moment';
import ReactMoE, {
    MoEGeoLocation,
    MoEProperties,
} from "react-native-moengage";
import * as Tools from '../../Tools/Components/Tools.js';
import WebServices from '../constants/WebServices.js';

const paymentType="Skipcash";
const Log=false;

function logEvent(_methodName,_dataIn){
    if(Log){
        console.log(_methodName+":"+JSON.stringify(_dataIn));
    }
}
// Function 1: Log a "Purchase" event with relevant data
export async function logPurchaseFailedEvent(_cart,_shopCart){
    try {
        let itemsIn=addItems(_cart,_shopCart);
        if(!Tools.IsNull(itemsIn)){
            let properties = new MoEProperties();
            properties.addAttribute("currency", "QAR");
            properties.addAttribute("price", itemsIn.price);
            properties.addAttribute("subTotal", itemsIn.subTotal);
            properties.addAttribute("quantity", itemsIn.quantity);
            properties.addAttribute("itemId", itemsIn.itemId);
            properties.addAttribute("itemDescription", itemsIn.itemDescription);
            properties.addAttribute("itemImageUrl", itemsIn.itemImageUrl);
            properties.addAttribute("category", itemsIn.category);
            properties.addAttribute("sub category", itemsIn.subcategory);
            properties.addAttribute("parkType", itemsIn.parkType);
            properties.addAttribute("itemName", itemsIn.itemName);
            properties.addAttribute("cartPrice", _shopCart.TotalAmount);
            properties.addAttribute("itemName", itemsIn.itemName);
            properties.addAttribute("discount", itemsIn.discount);
            properties.addAttribute("couponCode", itemsIn.couponCode);
            ReactMoE.trackEvent("purchase_failed", properties);
            dataIn={
                currency:"QAR",
                cartprice:_shopCart.TotalAmount,
                price:itemsIn.price,
                quantity:itemsIn.quantity,
                itemId:itemsIn.itemId,
                itemImageUrl:itemsIn.itemImageUrl,
                category:itemsIn.category,
                subcategory:itemsIn.subcategory,
                
                parkType:itemsIn.parkType
            };
            await analytics().logEvent('purchase_failed',dataIn);
            logEvent("logpurchase_failedEvent",dataIn);
        }
    } catch (error) {
        console.error('Error logging "logpurchase_failedEvent" event:', error);
    }
}


// Function 1: Log a "Purchase" event with relevant data
export async function logPurchaseEvent(_paymentResponse,_shopCart,_cart,_profile) {
    try {
        let itemsIn=addItems(_cart,_shopCart);
        // console.log("P : "+JSON.stringify(itemsIn));
        //moengage
        let properties = new MoEProperties();
        
        properties.addAttribute("currency", "QAR");
        properties.addAttribute("paymentType", "Skipcash");
        properties.addAttribute("category", itemsIn.category);
        properties.addAttribute("price", _paymentResponse.Amount);
        properties.addAttribute("orderid", _paymentResponse.OrderSummary.SaleCode);
        properties.addAttribute("transactionId", _paymentResponse.OrderSummary.TransactionId);
        properties.addAttribute("email", _profile.Email);
        if(!Tools.IsNull( itemsIn ))
            properties.addAttribute("couponCode",itemsIn.couponCode);
        properties.addAttribute("customername", _profile.FullName);
        if(!Tools.IsNull(_profile.BillingAddress)){
            properties.addAttribute("country", _profile.BillingAddress.country);
            properties.addAttribute("shippingAddress", _profile.BillingAddress.street+','+_profile.BillingAddress.city+','+_profile.BillingAddress.country+","+_profile.BillingAddress.postalCode);
        }
        ReactMoE.trackEvent("purchase_completed", properties);
        
        var dataIn={
            affiliation: "Leisure Store",
            currency: "QAR",
            start_date:moment(new Date()).format('YYYY-MM-DD'),
            price: _paymentResponse.Amount,
            transaction_id:_paymentResponse.OrderSummary.TransactionId,
        }
        await analytics().logEvent('purchase',dataIn );
        logEvent("logPurchaseEvent",dataIn);
        
    } catch (error) {
        console.error('Error logging "Purchase" event:', error);
    }
}

// Function 2: Log an "Add Payment Info" event
export async function logAddPaymentInfoEvent(_paymentResponse) {
    try {
        //moengage
        let properties = new MoEProperties();
        properties.addAttribute("price", _paymentResponse.Amount);
        properties.addAttribute("currency", "QAR");
        properties.addAttribute("paymenttype", paymentType);
        ReactMoE.trackEvent("payment_done", properties);
        
        await analytics().logEvent('add_payment_info', {
            currency:"QAR",
            value:_paymentResponse.Amount,
            coupon:"",
            payment_type:paymentType
        });
        logEvent("logAddPaymentInfoEvent",dataIn);
    } catch (error) {
        console.error('Error logging "Add Payment Info" event:', error);
    }
}

function addItemData(_cartItem,_price,_count=0){
    // console.log("Item"+JSON.stringify(_cartItem));
    items=[
        {
            item_id:_cartItem.ProductId,
            item_name:_cartItem.ProductName,
            affiliation: "Leisure Store",
            currency: "QAR",
            price: _price,
            quantity: _count
        } 
    ];
    return items;
}
function addItems(_cart,_shopCart){
    // console.log("cartItems :"+JSON.stringify(_cart));
    // console.log("shopCartItems :"+JSON.stringify(_shopCart));
    var category=[];
    var subcategory=[];
    var itemId=[];
    var parkType=[];
    var itemDescription=[];
    var itemImageUrl=[];
    var item={};
    var prices=[];
    var itemName=[];
    var quantity=[];
    var subTotal=[];
    var discount=[];
    var couponCode=[];
    if(Tools.IsNull(_shopCart)||Tools.IsNull(_shopCart.Items))
        return undefined;
    
    for (let index = 0; index < _shopCart.Items.length; index++) {
        
        const _shopCartItem = _shopCart.Items[index];
        // console.log("shopCartItem :"+JSON.stringify(_shopCartItem));
        
        const _cartItems = _cart.filter((itemCartIn)=>itemCartIn.item.value.Entity.ProductCode==_shopCartItem.ProductCode);
        const _cartItem =Tools.IsNull(_cartItems)?undefined:_cartItems[0];
        if(!Tools.IsNull(_cartItem)){
            category.push(Tools.IsNull(_cartItem.item.value.productTitle)?"":_cartItem.item.value.productTitle);
            subcategory.push(Tools.IsNull(_cartItem.item.value.Entity.CategoryName)?"":_cartItem.item.value.Entity.CategoryName);//category
            
            
            itemId.push(_cartItem.item.value.Entity.ProductCode);
            if(!Tools.IsNull(_cartItem.item.value.Entity.RichDescList)){
                var richtext=_cartItem.item.value.Entity.RichDescList.filter((itemLang)=>(itemLang.LangISO==="en"));
                itemDescription.push(richtext[0].Description);
            }
            parkType.push(_cartItem.item.value.parkType);
            if(!Tools.IsNull(_cartItem.item.value.CatalogName))
                itemName.push(_cartItem.item.value.CatalogName);
            itemImageUrl.push( WebServices.MainURL+_cartItem.item.value.Entity.ProfilePictureId);
            prices.push(_shopCartItem.UnitAmount);
            quantity.push(_shopCartItem.Quantity);
            subTotal.push(_shopCartItem.TotalAmount);
        }else{
            if (Tools.stringIsContains(_shopCartItem.GroupingDesc,WebServices.promo)){
                discount.push(_shopCartItem.TotalAmount);
                if(!Tools.IsNull(_shopCartItem.IndividualCouponCode)){
                    couponCode.push(_shopCartItem.IndividualCouponCode);
                }else{
                    if(!Tools.IsNull(_shopCartItem.ProductCode)){
                        couponCode.push(_shopCartItem.ProductCode);
                    }
                }
            }
        }
        
    }
    item.category=category;
    item.subcategory=subcategory;
    item.itemId=itemId;
    item.parkType=parkType;
    item.itemDescription=itemDescription;
    item.itemImageUrl=itemImageUrl;
    item.price=prices;
    item.subTotal=subTotal;
    item.quantity=quantity;
    item.itemName=itemName;
    item.discount=discount;
    item.couponCode=couponCode;
    item.currency= "QAR";
    // {
    //     "category":category,
    //     item_name:element.ProductName,
    //     affiliation: "Leisure Store",
    //     currency: "QAR",
    //     price: element.TotalAmount,
    //     quantity: element.Quantity
    // } 
    return item;
}
// Function 3: Log an "Add to Cart" event with relevant data
export async function logAddToCartEvent(_cartItem,_price,_count) {
    // console.log(_cartItem.item.value.Entity);
    try {
        
        //moengage
        let properties = new MoEProperties();
        properties.addAttribute("quantity", _count);
        if(!Tools.IsNull(_cartItem.item.value.Entity.ProductName)){
            properties.addAttribute("product", _cartItem.item.value.Entity.ProductName);
        }
        // console.log("Cart Item : "+JSON.stringify(_cartItem.item.value));
        // properties.addAttribute("productData",_cartItem.item.value.Entity)
        properties.addAttribute("currency", "QAR");
        properties.addAttribute("price", _price);//price
        properties.addAttribute("itemName", Tools.IsNull(_cartItem.item.value.CatalogName)?"":_cartItem.item.value.CatalogName);
        properties.addAttribute("category", Tools.IsNull(_cartItem.item.value.productTitle)?"":_cartItem.item.value.productTitle);//category
        properties.addAttribute("sub category", Tools.IsNull(_cartItem.item.value.Entity.CategoryName)?"":_cartItem.item.value.Entity.CategoryName);//category
        
        properties.addAttribute("itemId",  _cartItem.item.value.Entity.ProductCode);//category
        properties.addAttribute("parkType", _cartItem.item.value.parkType);//category
        if(!Tools.IsNull(_cartItem.item.value.Entity.RichDescList)){
            var richtext=_cartItem.item.value.Entity.RichDescList.filter((itemLang)=>(itemLang.LangISO==="en"));
            properties.addAttribute("itemDescription", richtext[0].Description);//category
        }
        
        if(!Tools.IsNull(_cartItem.item.value.Entity.ProfilePictureId)){
            properties.addAttribute("itemImageUrl", WebServices.MainURL+_cartItem.item.value.Entity.ProfilePictureId);//category
        }
        ReactMoE.trackEvent("product_added_to_cart", properties);
        
        dataIn={
            currency:"QAR",
            value:_price,
            items:addItemData(_cartItem.item.value.Entity,_price,_count)
        };
        await analytics().logEvent('add_to_cart',dataIn);
        logEvent("logAddToCartEvent",dataIn);
        
        
        
    } catch (error) {
        console.error('Error logging "Add to Cart" event:', error);
    }
}

// Function 4: Log an "Remove from Cart" event with relevant data
export async function logRemoveFromCartEvent(_cartItem) {
    try {
        let itemsIn=addItemData(_cartItem,_cartItem.item.value.Pricelist[0].Price,_cartItem.Quantity);
        let properties = new MoEProperties();
        properties.addAttribute("currency", "QAR");
        properties.addAttribute("price", _cartItem.item.value.Pricelist[0].Price);
        properties.addAttribute("itemName", Tools.IsNull(_cartItem.item.value.CatalogName)?"":_cartItem.item.value.CatalogName);
        properties.addAttribute("category", Tools.IsNull(_cartItem.item.value.productTitle)?"":_cartItem.item.value.productTitle);//category
        properties.addAttribute("sub category", Tools.IsNull(_cartItem.item.value.Entity.CategoryName)?"":_cartItem.item.value.Entity.CategoryName);//category
        properties.addAttribute("itemId",  _cartItem.item.value.Entity.ProductCode);//category
        properties.addAttribute("parkType", _cartItem.item.value.parkType);//category
        if(!Tools.IsNull(_cartItem.item.value.Entity.RichDescList)){
            var richtext=_cartItem.item.value.Entity.RichDescList.filter((itemLang)=>(itemLang.LangISO==="en"));
            properties.addAttribute("itemDescription", richtext[0].Description);//category
        }
        
        if(!Tools.IsNull(_cartItem.item.value.Entity.ProfilePictureId)){
            properties.addAttribute("itemImageUrl", WebServices.MainURL+_cartItem.item.value.Entity.ProfilePictureId);//category
        }
        
        ReactMoE.trackEvent("remove_from_cart", properties);
        
        dataIn={
            currency:"QAR",
            value:_cartItem.item.value.Pricelist[0].Price,
            items:itemsIn
        };
        await analytics().logEvent('remove_from_cart',dataIn);
        logEvent("logRemoveFromCartEvent",dataIn);
    } catch (error) {
        console.error('Error logging "Remove to Cart" event:', error);
    }
}

// Function 5: Log an "BeginCheckOut" event with relevant data
export async function logBeginCheckoutEvent(_cart,_shopCart) {
    try {
        
        let itemsIn=addItems(_cart,_shopCart);
        
        let properties = new MoEProperties();
        properties.addAttribute("currency", "QAR");
        properties.addAttribute("price", itemsIn.price);
        properties.addAttribute("subTotal", itemsIn.subTotal);
        properties.addAttribute("quantity", itemsIn.quantity);
        properties.addAttribute("itemId", itemsIn.itemId);
        properties.addAttribute("itemDescription", itemsIn.itemDescription);
        properties.addAttribute("itemImageUrl", itemsIn.itemImageUrl);
        properties.addAttribute("category", itemsIn.category);
        properties.addAttribute("sub category", itemsIn.subcategory);
        properties.addAttribute("parkType", itemsIn.parkType);
        properties.addAttribute("itemName", itemsIn.itemName);
        properties.addAttribute("cartPrice", _shopCart.TotalAmount);
        properties.addAttribute("discount", itemsIn.discount);
        properties.addAttribute("couponCode", itemsIn.couponCode);
        ReactMoE.trackEvent("payment_started", properties);
        
        dataIn={
            currency:"QAR",
            cartprice:_shopCart.TotalAmount,
            price:itemsIn.price,
            quantity:itemsIn.quantity,
            itemId:itemsIn.itemId,
            itemImageUrl:itemsIn.itemImageUrl,
            category:itemsIn.category,
            subcategory:itemsIn.subcategory,
            parkType:itemsIn.parkType
        };
        await analytics().logEvent('begin_checkout',dataIn);
        logEvent("logBeginCheckoutEvent",dataIn);
    } catch (error) {
        console.error('Error logging "begin_checkout" event:', error);
    }
}

// Function 6: Log an "logLoginEvent" event with relevant data
export async function logLoginEvent(_type,userid) {
    try {
        console.log("logLoginEvent");
        let properties = new MoEProperties();
        properties.addAttribute("method",_type);
        properties.addAttribute("loginid", userid);
        ReactMoE.trackEvent("user_login", properties);
        
        dataIn={
            method:_type
        };
        await analytics().logEvent('login',dataIn);
        logEvent("logLoginEvent",dataIn);
    } catch (error) {
        console.error('Error logging "logLoginEvent" event:', error);
    }
}

// Function 6: Log an "logLoginEvent" event with relevant data
export async function logLogoutEvent(mobile,_type) {
    try {
        console.log("logLogoutEvent");
        
        let properties = new MoEProperties();
        properties.addAttribute("memeberid",_type);
        properties.addAttribute("mobile",mobile);
        ReactMoE.trackEvent("user_logout", properties);
        
        dataIn={
            method:_type
        };
        await analytics().logEvent('login',dataIn);
        logEvent("logLoginEvent",dataIn);
    } catch (error) {
        console.error('Error logging "logLoginEvent" event:', error);
    }
}

// Function 7: Log an "logSignUpEvent" event with relevant data
export async function logSignUpEvent(user_id,memeber_id) {
    try {
        let properties = new MoEProperties();
        properties.addAttribute("usedid",user_id);
        properties.addAttribute("memberid",memeber_id);
        ReactMoE.trackEvent("user_registered", properties);
        
        dataIn={
            usedid:user_id,
            memberid:memeber_id
        };
        await analytics().logEvent('sign_up',dataIn);
        logEvent("logSignUpEvent",dataIn);
    } catch (error) {
        console.error('Error logging "logSignUpEvent" event:', error);
    }
}

// Function 8: Log an "logViewItemEvent" event with relevant data
export async function logViewItemEvent(_Item,_price) {
    try {
        let itemsIn=addItemData(_Item,_price);
        let properties = new MoEProperties();
        properties.addAttribute("currency", "QAR");
        properties.addAttribute("items", itemsIn);
        properties.addAttribute("price", _price);
        ReactMoE.trackEvent("product_viewed", properties);
        
        dataIn={
            currency:"QAR",
            value:_price,
            items:itemsIn
        };
        await analytics().logEvent('view_item',dataIn);
        logEvent("logViewItemEvent",dataIn);
    } catch (error) {
        console.error('Error logging "logViewItemEvent" event:', error);
    }
}

// Function 9: Log an "logScreenViewEvent" event with relevant data
export async function logScreenViewEvent(_class,_name) {
    try {
        let properties = new MoEProperties();
        properties.addAttribute("screenclass", _class);
        properties.addAttribute("screenname", _name);
        ReactMoE.trackEvent("page_viewed", properties);
        
        dataIn={
            screen_class:_class,
            screen_name:_name,
        };
        await analytics().logEvent('screen_view',dataIn);
        logEvent("logScreenViewEvent",dataIn);
    } catch (error) {
        console.error('Error logging "logScreenViewEvent" event:', error);
    }
}

// Function 10: Log an "Banner" event with relevant data
export async function logBannerEvent(bannerData,selected=-1) {
    try {
        let properties = new MoEProperties();
        properties.addAttribute("type", bannerData.bannerType);
        if(selected!=-1){
            properties.addAttribute("selected", selected);
        }
        properties.addAttribute("isDone", bannerData.isDone);
        ReactMoE.trackEvent("banner_clicked", properties);
        dataIn={
            type:bannerData.bannerType,
            isDone:bannerData.isDone
        };
        if(selected!=-1){
            dataIn.selected=selected;
        }
        await analytics().logEvent('bannerEvent',dataIn);
        logEvent("bannerEvent",dataIn);
    } catch (error) {
        console.error('Error logging "bannerEvent" event:', error);
    }
}

// Function 11: Log an "ClaimEvent" event with relevant data
export async function logClaimEvent(dataIn) {
    try {
        let properties = new MoEProperties();
        properties.addAttribute("status", dataIn[0]);
        properties.addAttribute("details", dataIn[1]);
        ReactMoE.trackEvent("claim_point", properties);
        dataIn={
            status:dataIn[0],
            details:dataIn[1]
        };
        await analytics().logEvent('claimEvent',dataIn);
        logEvent("claimEvent",dataIn);
    } catch (error) {
        console.error('Error logging "claimEvent" event:', error);
    }
}

// Function 12: Log an "Redeem" event with relevant data
export async function logRedeemClickEvent(mypoints,clickedPoints) {
    try {
        let properties = new MoEProperties();
        properties.addAttribute("profilePoints", mypoints);
        properties.addAttribute("redeemPoints", clickedPoints);
        ReactMoE.trackEvent("redeeem_point", properties);
        dataIn={
            profilePoints:mypoints,
            redeemPoints:clickedPoints
        };
        await analytics().logEvent('redeeemClickEvent',dataIn);
        logEvent("redeeemClickEvent",dataIn);
    } catch (error) {
        console.error('Error logging "redeeemClickEvent" event:', error);
    }
}
// Function 13: Log an "ShareInvite" event with relevant data

export async function logShareInviteClickEvent(code) {
    try {
        let properties = new MoEProperties();
        properties.addAttribute("inviteCode", code);
        ReactMoE.trackEvent("share_invite", properties);
        dataIn={
            inviteCode:code,
        };
        await analytics().logEvent('shareInvite',dataIn);
        logEvent("shareInvite",dataIn);
    } catch (error) {
        console.error('Error logging "shareInvite" event:', error);
    }
}

// Function 5: Log an "ViewCart" event with relevant data
export async function logViewCartEvent(_cart,_shopCart) {
    try {
        
        let itemsIn=addItems(_cart,_shopCart);
        if(!Tools.IsNull(itemsIn)){
            let properties = new MoEProperties();
            properties.addAttribute("currency", "QAR");
            properties.addAttribute("price", itemsIn.price);
            properties.addAttribute("subTotal", itemsIn.subTotal);
            properties.addAttribute("quantity", itemsIn.quantity);
            properties.addAttribute("itemId", itemsIn.itemId);
            properties.addAttribute("itemDescription", itemsIn.itemDescription);
            properties.addAttribute("itemImageUrl", itemsIn.itemImageUrl);
            properties.addAttribute("category", itemsIn.category);
            properties.addAttribute("sub category", itemsIn.subcategory);
            properties.addAttribute("parkType", itemsIn.parkType);
            properties.addAttribute("itemName", itemsIn.itemName);
            properties.addAttribute("cartPrice", _shopCart.TotalAmount);
            properties.addAttribute("itemName", itemsIn.itemName);
            properties.addAttribute("discount", itemsIn.discount);
            properties.addAttribute("couponCode", itemsIn.couponCode);
            ReactMoE.trackEvent("view_cart", properties);
            dataIn={
                currency:"QAR",
                cartprice:_shopCart.TotalAmount,
                price:itemsIn.price,
                quantity:itemsIn.quantity,
                itemId:itemsIn.itemId,
                itemImageUrl:itemsIn.itemImageUrl,
                category:itemsIn.category,
                subcategory:itemsIn.subcategory,
                
                parkType:itemsIn.parkType
            };
            await analytics().logEvent('view_cart',dataIn);
            logEvent("logViewCartEvent",dataIn);
        }
    } catch (error) {
        console.error('Error logging "logViewCartEvent" event:', error);
    }
}

// Function 5: Log an "CancelPayment" event with relevant data
export async function logCancelPaymentEvent(_cart,_shopCart) {
    // console.log('logcancelPaymentEvent _cart:'+ JSON.stringify(_cart));
    // console.log('_shopCart :'+ JSON.stringify(_shopCart));

    try {
        
        let itemsIn=addItems(_cart,_shopCart);
        if(!Tools.IsNull(itemsIn)){
            let properties = new MoEProperties();
            properties.addAttribute("currency", "QAR");
            properties.addAttribute("price", itemsIn.price);
            properties.addAttribute("subTotal", itemsIn.subTotal);
            properties.addAttribute("quantity", itemsIn.quantity);
            properties.addAttribute("itemId", itemsIn.itemId);
            properties.addAttribute("itemDescription", itemsIn.itemDescription);
            properties.addAttribute("itemImageUrl", itemsIn.itemImageUrl);
            properties.addAttribute("category", itemsIn.category);
            properties.addAttribute("sub category", itemsIn.subcategory);
            properties.addAttribute("parkType", itemsIn.parkType);
            properties.addAttribute("itemName", itemsIn.itemName);
            properties.addAttribute("cartPrice", _shopCart.TotalAmount);
            properties.addAttribute("itemName", itemsIn.itemName);
            properties.addAttribute("discount", itemsIn.discount);
            properties.addAttribute("couponCode", itemsIn.couponCode);
            ReactMoE.trackEvent("cancel_payment", properties);
            dataIn={
                currency:"QAR",
                cartprice:_shopCart.TotalAmount,
                price:itemsIn.price,
                quantity:itemsIn.quantity,
                itemId:itemsIn.itemId,
                itemImageUrl:itemsIn.itemImageUrl,
                category:itemsIn.category,
                subcategory:itemsIn.subcategory,
                
                parkType:itemsIn.parkType
            };
            await analytics().logEvent('cancel_payment',dataIn);
            logEvent("logcancelPaymentEvent",dataIn);
        }
    } catch (error) {
        console.error('Error logging "logcancelPaymentEvent" event:', error);
    }
}
