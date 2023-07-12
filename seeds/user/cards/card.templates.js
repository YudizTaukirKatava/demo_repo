const _card_templates = {};
const _notification_temp = {};

_card_templates.collection = `
<div class="col-otr col-lg-2 col-md-3 col-sm-4">
    <div class="col-inr box1">
        <div class="img-otr">
            <div class="nft-explore-img-wrapper">
                <a href="<%= (data.isAdminSide) ? '/a/single-collection' : '/collection' %>/<%= data._id %>" class="tilt-otr img-tilt" data-tilt="">
                    <img loading="lazy" id="auction-img" class="img-inr img-fluid"
                        src="<%= data.sImageUrl %>"
                        onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';" alt="artwork-img">
                    <div class="js-tilt-glare"
                        style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; overflow: hidden; pointer-events: none;">
                        <div class="js-tilt-glare-inner"
                            style="position: absolute; top: 50%; left: 50%; background-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%); width: 0px; height: 0px; transform: rotate(180deg) translate(-50%, -50%); transform-origin: 0% 0% 0px; opacity: 0;">
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <a href="/collection/<%= data._id %>" class="body-mb box-head">
            <%= data.sName %>
        </a>
    </div>
</div>
`;

_card_templates.slider = `<div class="hero-mainn secondary-slide">
<div class="container-fluid">
    <div class="hero-inr">
        <div class="row row-custom justify-content-center">
            <div class="col-4 col-img-otr">
                <div class="bg-gradient">
                    <div class="bg-gradient-inr">
                        <marquee class="marq1" amount="2" direction="left">
                            <ul class="marq-ul">
                                <li class="marq-li">
                                    -
                                </li>
                            </ul>
                        </marquee>
                        <marquee class="marq2" amount="2" direction="right">
                            <ul class="marq-ul">
                                <li class="marq-li">
                                    -
                                </li>
                            </ul>
                        </marquee>
                    </div>
                </div>
                <div class="col-img-inr">
                    <div class="nft-img-wrapper">
                        <a id="hero-view-nft" href="/nft/" class="img-otr img-tilt"
                            data-tilt>
                            <img class="artwork-img img-fluid" id="landingAuctionImg" src=""
                                onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';"
                                alt="artwork-img" />
                        </a>
                    </div>
                    <div class="create-otr">
                        <div class="create-inr">
                            <a id="hero-profile-id" href="" class="create-img">
                                <img id="hero-profilePic" class="img-create" src=""
                                    onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';"
                                    alt="create-img" />
                                <div class="check-otr" id="isVerified">
                                    <svg class="check-icon" width="10" height="10"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.438 2.813L4.061 7.188 1.876 5"
                                            stroke="#fff" stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </a>
                            <div class="create-content">
                                <p class="body-s create-p">
                                    Owned by
                                </p>
                                <a id="hero-owner-name" href=""
                                    class="body-sb create-pb">Unknown</a>
                            </div>

                            <div class="hover-box">
                                <div class="hover-box-inr">
                                    <div class="user-info">
                                        <a id="hover-hero-profileId" href=""
                                            class="create-img">
                                            <img id="hero-profilePic1" class="img-create"
                                                src=""
                                                onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';"
                                                alt="create-img" />
                                            <div class="check-otr" id="hero-hover-verified">
                                                <svg class="check-icon" width="10"
                                                    height="10" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.438 2.813L4.061 7.188 1.876 5"
                                                        stroke="#fff" stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                        </a>
                                        <div id="landingSingle">

                                        </div>
                                    </div>
                                    <p id="hero-nftOwner-name" class="post-title body-lb">
                                        
                                    </p>
                                    <a id="hero-walletaddress-profile" href=""
                                        class="address-main">
                                        <p id="hero-walletaddress" class="address body-s">
                                            0x
                                        </p>
                                        <svg id="copy-hero-address" class="copy-icon"
                                            width="18" height="18" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12.636 12.636H15a2 2 0 002-2V3a2 2 0 00-2-2H7.364a2 2 0 00-2 2v2.364"
                                                stroke="#CFCFCF" stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M10.636 5.364H3a2 2 0 00-2 2V15a2 2 0 002 2h7.636a2 2 0 002-2V7.364a2 2 0 00-2-2z"
                                                stroke="#CFCFCF" stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </a>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="heart-main">
                            <a class="heart-otr">
                                <svg class="heart-icon" width="18" height="17" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9 15.08S1 10.6 1 5.16a4.16 4.16 0 018-1.603h0a4.16 4.16 0 018 1.603c0 5.44-8 9.92-8 9.92z"
                                        stroke="#999" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                            <p id="hero-nft-likes" class="body-sb num">
                                
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

</div>
</div>`;

_card_templates.nft = `<div class="col-otr <%=data.classToAdd%>">
                <div class="col-inr box1">
                    <div class="img-otr">
                        <div class="nft-explore-img-wrapper">
                            <a href="<%=
                                data.nftLink
                            %>" class="tilt-otr img-tilt" data-tilt>
                                <div class="currency-logo">
                                    <img loading="lazy" src="/assets/img/<%=data.chainId%>.svg" alt="Avalanche">
                                </div>
                                <img loading="lazy"
                                    id="nft-img"
                                    class="img-inr img-fluid"
                                    src="<%=data.imageUrl%>"
                                    alt="artwork-img"
                                    onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';"
                                />
                            </a>
                        </div>
                        <%-data.time%>   
                        <%-data.sNetworkName%>   

                    </div>
                    <div class="time-main">
                        <div class="users-main">    
                            <div class="create-img-otr">
                                <a href="/creator/<%=
                                    data.aCurrentOwner._id
                                %>" class="create-img" >
                                    <img loading="lazy"
                                        class="img-create"
                                        src="<%=data.sCurrentOwnerProfilePic%>"
                                        alt="create-img"
                                        onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';" />
                                    <div class="<%=
                                        data.isOwnerVerified ? 'check-otr' : ''
                                    %>" >
                                        <%- data.isOwnerVerified ? '<svg class="check-icon"  width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.438 2.813L4.061 7.188 1.876 5" stroke="#e42575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>': '' %>
                                    </div>
                                </a>
                                <div class="hover-box hover-box2" >
                                    <div class="hover-box-inr" >
                                        <div class="user-info" >
                                            
                                            <%-
                                                data.aCurrentOwner
                                                    .sWalletAddress ==
                                                    localStorage.getItem(
                                                        'sWalletAddress'
                                                    ) ||
                                                !localStorage.getItem(
                                                    'sWalletAddress'
                                                )
                                                    ? ''
                                                    : data.followCurrent
                                            %>
                                        </div>
                                        <p class="post-title body-lb" >
                                            <%=data.aCurrentOwner.sUserName%>
                                        </p>
                                        <div>
                                            <a
                                                href="javascript:void(0)" class="address-main" >
                                                <p class="address body-s" >
                                                    <%=_helper.trimEthereumAddress(
                                                        data.sCurrentOwnerWalletAddress,
                                                        7
                                                    )%>
                                                </p>
                                                <svg
                                                    onclick="return copyDataToClipBoard('<%=data.sCurrentOwnerWalletAddress%>')"
                                                    class="copy-icon"
                                                    width="18"
                                                    height="18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg" >
                                                    <path
                                                        d="M12.636 12.636H15a2 2 0 002-2V3a2 2 0 00-2-2H7.364a2 2 0 00-2 2v2.364"
                                                        stroke="#CFCFCF"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                    <path
                                                        d="M10.636 5.364H3a2 2 0 00-2 2V15a2 2 0 002 2h7.636a2 2 0 002-2V7.364a2 2 0 00-2-2z"
                                                        stroke="#CFCFCF"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="heart-main">
                            <a class="heart-otr c-pointer <%=data.aFavorite.indexOf(data.id) != -1 ? 'selected' : ''%>" 
                            data-liked="<%=data.aFavorite.indexOf(data.id) != -1 ? 'true' : 'false'%>" data-nftid="<%=data._id%>" onclick="likeNFT($(this))">
                                <svg
                                    class="heart-icon"
                                    width="18"
                                    height="17"
                                    fill="none"    
                                    xmlns="http://www.w3.org/2000/svg" >
                                    <path
                                        d="M9 15.08S1 10.6 1 5.16a4.16 4.16 0 018-1.603h0a4.16 4.16 0 018 1.603c0 5.44-8 9.92-8 9.92z"
                                        stroke="#999"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </a>
                            <p class="body-sb num" >
                                
                            </p>
                        </div>
                    </div>
                    <a
                        href="<%=data.nftLink%>"
                        class="body-mb box-head"
                        ><%=data.sName%></a>
                    <div class="bid-main">
                        <p class="body-sb bid">
                            <%=
                                data.eAuctionType ||
                                data.aTransactionDetail[0].eBidStatus ==
                                    'On Auction'
                                    ? 'Base Price'
                                    : 'Price'
                            %>
                        </p>
                        <p class="body-mb eth"><%=
                        data.nBidPrice ||
                        data.nBasePrice ||
                        data.aTransactionDetail[0].nBidPrice
                        %> <%=data.currencySymbol%></p>
                    </div>
                </div>
            </div>`;

_card_templates.activity = `
<div class="place-bid-main ">
    <div class="place-content-grp ">
        <div class="slide-down-buttons"></div>
        <a class="img-otr" href="<%= data.nftUrl %>">
            <img loading="lazy" class="activity-img" src="<%= data.nftImage %>" alt="activity" onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';">
        </a>
        <div class="bid-content">
            <div class="content-left">
                <p class="body-mb bid-otr" style="color: #fff;">
                    <%= data.nftName %>
                </p>
                <p class="body-mb bid-otr activity-subtitle" style="color: #fff;">
                    <span><%= data.activityType %> </span><%= data.userName %>
                </p>

                <p class="body-s date" data-toggle="tooltip" data-placement="bottom"
                    title="" data-bs-original-title="December 21, 2022 12:49 PM">
                    <a target="_blank" href="<%= data.txLink %>"
                        target="_blank">
                        <%= data.activityDate %>
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
`;

_card_templates.notification = `
    <div class="single-noti">
            <div class="noti-img">
                <a href="<%= data.imageUrl %>"> 
                    <img loading="lazy" src="<%= data.sImage %>" onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';" alt="artwork-img">
                </a>
            </div>
            <div class="noti-desc">
                <p class="<%= data.bViewed %>"><%= data.notificationType %></p>
                <label><a style="color: #a197aa" href="<%= data.txLink %>" target="_blank"><%= data.activityDate %> <i class="fa fa-external-link"></i></a></label>
            </div>
    </div>`;

_card_templates.royalty = `
<div class="progress-otr">
    <div class="holder">
        <div class="holder-img">
            <img loading="lazy" src="<%= data.sImage %>"
                onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';"
                alt="user">
        </div>
    </div>
    <div class="progress">
        <p class="holder-name body-sb">
            <%= data.sName %>
        </p>
        <div class="progress-bar" role="progressbar" aria-valuenow="<%= data.nPercentage %>"
            aria-valuemin="0" aria-valuemax="100" style="width: <%= data.nPercentage %>%;">
        </div>
        <span class="progress-percentage"><%= data.nPercentage %>%</span>
    </div>
</div>`;

_card_templates.generalActivity = `
<div class="place-bid-main <%= data.classToAdd %>">
    <div class="place-content-grp ">
        <div class="slide-down-buttons"></div>
        <div class="mobile-activity-imgs">
            <a class="img-otr">
                <img loading="lazy" class="img-bid" src="<%= data.type %>"
                    onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';"
                    alt="Bid">
            </a>
            <a class="img-otr for-mobile"
                href="/nft/<%=data.sNFTId%>">
                <img loading="lazy" class="activity-img"
                    src="<%=data.nftImage%>"
                    alt="activity"
                    onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';">
            </a>
        </div>
        <div class="bid-content">
            <div class="content-left">
                <p class="body-mb bid-otr">
                    <a href="/creator/<%= data.userId %>"
                        class="user"><%= data.activityType %></a>
                </p>
                <p class="body-s date" data-toggle="tooltip"
                    data-placement="bottom" title=""
                    data-bs-original-title="December 21, 2022 12:49 PM">
                    <a href="<%= data.txLink %>" <%-data.target %> >
                        <%= data.activityDate %>
                        <%- data.link %>
                    </a>
                </p>
            </div>
            <div class="content-right <%= (data.isReceivedBid) ? 'with-img' : '' %>">
                <% if(data.isReceivedBid) { %>
                    <div>
                        <p class="eth heading-h5">
                            <%=data.sPrice %> <%=data.currencySymbol%>
                        </p>
                        <p class="dollor body-sb">
                            $<%=data.priceInUsd %>
                        </p>
                    </div>
                <% } %>
                <a class="img-otr for-desktop"
                target="<%= (data.isAdminSide) ? '_blank' : '' %>"
                href="/nft/<%=data.sNFTId%>">
                    <img loading="lazy" class="activity-img"
                        src="<%=data.nftImage%>"
                        alt="activity"
                        onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';">
                </a>
            </div>
        </div>
    </div>
    <% if(data.isBidActivity) { %>
        <div class="place-bid-button-grp slide-this">
            <% if(data.isReceivedBid) { %>
                <button class="activity-box-btn green-activity-btn"
                    bidder-address="<%=data.bidData.bidderAddress %>" nft-id="<%=data.bidData.tokenId %>"
                    collection-address="<%=data.bidData.collectionAddress %>"
                    quantity="<%=data.bidData.quantity %>" scollection="<%=data.bidData.sCollection %>"
                    ownerid="<%=data.bidData.ownerId %>"
                    _id="<%=data.bidData._id %>"
                    nChainId="<%=data.bidData.chainId %>"
                    sProfilepicurl="undefined" amount="<%=data.bidData.amount %>"
                    onclick="callAcceptBid($(this))"><i class="fa-solid fa-check"></i>
                    Accept
                </button>
                <button class="activity-box-btn red-activity-btn"
                    bidder-address="<%=data.bidData.bidderAddress %>" nft-id="<%=data.bidData.tokenId %>"
                    collection-address="<%=data.bidData.collectionAddress %>"
                    quantity="<%=data.bidData.quantity %>" scollection="<%=data.bidData.sCollection %>"
                    ownerid="<%=data.bidData.ownerId %>"
                    _id="<%=data.bidData._id %>"
                    nChainId="<%=data.bidData.chainId %>"
                    sProfilepicurl="undefined" amount="<%=data.bidData.amount %>"
                    onclick="callRejectBid($(this))"><i class="fa-solid fa-xmark"></i>
                    Reject
                </button>
            <% } else { %>
                <a href="javascript:void(0)"
                    tokenId="<%=data.bidData.tokenId %>"
                    collection-address="<%=data.bidData.collectionAddress %>"
                    nChainId="<%=data.bidData.chainId %>"
                    from ="<%=data.bidData.from %>"
                    class="activity-box-btn red-activity-btn withdraw-btn-main" onclick="callWithdraw($(this))"><i
                        class="fa-solid fa-xmark">
                    </i>
                    Withdraw
                </a>
            <% } %>
        </div>
    <% } %>
</div>
`;

_card_templates.searchCollection = `
<div class="col-otr ">
<div class="col-inr box1">
    <div class="img-otr">
        <div class="nft-explore-img-wrapper">
            <a href="/collection/<%= data._id%>" class="tilt-otr img-tilt" data-tilt="">
                <img loading="lazy" id="auction-img" class="img-inr img-fluid"
                    src="<%= data.sImageUrl%>"
                    onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';"
                    alt="artwork-img">
                <div class="js-tilt-glare"
                    style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; overflow: hidden; pointer-events: none;">
                    <div class="js-tilt-glare-inner"
                        style="position: absolute; top: 50%; left: 50%; background-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%); width: 0px; height: 0px; transform: rotate(180deg) translate(-50%, -50%); transform-origin: 0% 0% 0px; opacity: 0;">
                    </div>
                </div>
            </a>

        </div>
    </div>
    <a href="/collection/<%= data._id%>" class="body-mb box-head">Robo<%= data.sName%></a>
    </div>
</div>`;

_card_templates.landingSquareImgGroup = `
<div class="img-inr">
    <%
    data.forEach(img => {
    %>
        <div class="col-img-inr">
                <img loading="lazy"
                    class="about-img img-fluid"
                    src="<%= img %>"
                    onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';"
                    alt="img"
                />
        </div>
    <%
    });
    %>
</div>`;

_card_templates.creator = `
<div class="col-lg-2 col-md-3 col-sm-4 creator-otr">
    <a href="/creator/<%= data._id %>" class="create-inr box1">
        <div class="create-img">
            <img loading="lazy"
                class="img-create"
                src="<%= data.sProfilePicThumbUrl %>"
                onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';"
                alt="create-img"
            /> 
            <% if(data.bVerify) { %>
                <div class="check-otr" id="blue-tick-creatorOfWeek" >
                    <svg class="check-icon"  width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.438 2.813L4.061 7.188 1.876 5" stroke="#e42575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
            <% } %>
        </div>
        <div class="create-content">
            <p class="body-sb create-pb">
                <%= data.sUserName || 'Unknown' %>
            </p>
            <p class="body-s create-p">
                <%= data.earnings %>
            </p>
        </div>
    </a>
</div>`;

_card_templates.follower = `
<div class="create-inr box1">
    <div class="profile-otr">
        <div class="create-img">
            <a href="/creator/<%= data._id %>">
                <img loading="lazy" class="img-create" src="<%= data.sProfilePic %>" alt="create-img">
            </a>
            <div class="check-otr">
                <svg class="check-icon" width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.438 2.813L4.061 7.188 1.876 5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
        </div>
        <div class="create-content">
            <a href="/creator/<%= data._id %>" class="body-sb create-pb">
                <%= data.sUserName %>
            </a>
        </div>
    </div>
    <% if(data.showBtn) { %>
        <div class="follow-otr">
            <a href="" class="btn-outline2 btn-follow" onclick="followCreator($(this))"
                data-isFollowed="<%= data.data_isFollowed %>"
                data-_id="<%= data._id %>">
                <%= data.data_btn %>
            </a>
        </div>
    <% } %>
</div>`;

_card_templates.secondarySlide = `
<div class="hero-mainn secondary-slide">
    <div class="container-fluid">
        <div class="hero-inr">
            <div class="row row-custom justify-content-center">
                <div class="col-4 col-img-otr">
                    <div class="bg-gradient">
                        <div class="bg-gradient-inr">
                            <marquee class="marq1" amount="2" direction="left">
                                <ul class="marq-ul">
                                    <li class="marq-li">
                                        <%= data.sName %>
                                    </li>
                                </ul>
                            </marquee>
                            <marquee class="marq2" amount="2" direction="right">
                                <ul class="marq-ul">
                                    <li class="marq-li">
                                        <%= data.sName %>
                                    </li>
                                </ul>
                            </marquee>
                        </div>
                    </div>
                    <div class="col-img-inr">
                        <div class="nft-img-wrapper">
                            <a href="/nft/<%= data._id %>" class="img-otr img-tilt"
                                data-tilt>
                                <img class="artwork-img img-fluid" src="<%= data.sImage %>"
                                    onerror="this.onerror=null;this.src='/assets/img/New_Project_1.jpg';"
                                    alt="artwork-img" />
                            </a>
                        </div>
                        <div class="create-otr">
                            <div class="create-inr">
                                <a href="/creator/<%= data.oCurrentOwnerId %>" class="create-img">
                                    <img class="img-create" src="<%= data.sCurruntOwnerPic %>"
                                        onerror="this.onerror=null;this.src='/assets/img/male-avatar-maker.jpg';"
                                        alt="create-img" />
                                    <div class="check-otr">
                                        <svg class="check-icon" width="10" height="10"
                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.438 2.813L4.061 7.188 1.876 5"
                                                stroke="#fff" stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </a>
                                <div class="create-content">
                                    <p class="body-s create-p">
                                        Owned by
                                    </p>
                                    <a href="/creator/<%= data.oCurrentOwnerId %>"
                                        class="body-sb create-pb">
                                        <%= data.sCurruntOwnerName %>
                                    </a>
                                </div>
                                <div class="hover-box">
                                    <div class="hover-box-inr">
                                        <p class="post-title body-lb">
                                            <%= data.sCurruntOwnerName || 'Unknown' %>
                                        </p>
                                        <a href="/creator/<%= data.oCurrentOwnerId %>"
                                            class="address-main">
                                            <p class="address body-s">
                                                <%= data.sEthAddressTrim %>
                                            </p>
                                            <svg id="clicked" class="copy-icon"
                                            onclick="return copyDataToClipBoard('<%= data.sEthAddress %>')"
                                                width="18" height="18" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12.636 12.636H15a2 2 0 002-2V3a2 2 0 00-2-2H7.364a2 2 0 00-2 2v2.364"
                                                    stroke="#CFCFCF" stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path
                                                    d="M10.636 5.364H3a2 2 0 00-2 2V15a2 2 0 002 2h7.636a2 2 0 002-2V7.364a2 2 0 00-2-2z"
                                                    stroke="#CFCFCF" stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="heart-main">
                                <a class="heart-otr c-pointer <%= data.sLikeSelected %>"
                                data-liked="<%= data.sLikeData %>"
                                data-nftid="<%= data._id %>" onclick="likeNFT($(this))">
                                    <svg class="heart-icon" width="18" height="17" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9 15.08S1 10.6 1 5.16a4.16 4.16 0 018-1.603h0a4.16 4.16 0 018 1.603c0 5.44-8 9.92-8 9.92z"
                                            stroke="#999" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </a>
                                <p class="body-sb num">
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
