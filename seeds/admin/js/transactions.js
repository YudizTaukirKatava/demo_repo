$(document).ready(function () {
    $(function () {
        $('#transactionTable').DataTable({
            responsive: false,
            processing: true,
            serverSide: true,
            ajax: _helper.getDataTableAJAX('POST', '/admin/transactions'),
            aoColumns: [
                {
                    mData: 'sTransactionHash',
                    render: function (mData, type, row) {
                        return `<td><a href="${
                            _chains_web3[row.oNFT[0].nChainId]
                                .blockExplorerUrls[0]
                        }/tx/${mData}" target="_blank">${_helper.trimEthereumAddress(
                            mData,
                            10
                        )}</a></td>`;
                    },
                },
                {
                    mData: 'eBidStatus',
                },
                {
                    mData: 'oUser[0].sUserName',
                    render: function (mData, type, row) {
                        if (mData == undefined || mData == '') {
                            let address = row.oUser[0].sWalletAddress;
                            let firstFive = address.slice(0, 10);
                            let lastFive = address.slice(
                                address.length - 8,
                                address.length
                            );
                            return `<td>${firstFive}...${lastFive}</td>`;
                        } else {
                            return `<td>${mData}</td>`;
                        }
                    },
                },
                {
                    mData: 'sCreated',
                    render: function (mData, type, row) {
                        return `<td>${formatDate(mData)}</td>`;
                    },
                },
                {
                    mData: 'nBidPrice',
                    render: function (mData, type, row) {
                        let currencySymbol =
                            _chains_web3[row.oNFT[0].nChainId].nativeCurrency
                                .symbol;

                        return `<td>${mData} ${currencySymbol}</td>`;
                    },
                },
                {
                    mData: 'oNFT',
                    render: function (mData, type, row) {
                        let nChainId = mData[0].nChainId;
                        let nftImage = mData[0]?.sImageHash
                            ? `${
                                  _platform_config[___ENV___].sS3Location +
                                  mData[0].sImageHash
                              }`
                            : 'https://yudiz-blockchain.s3.ap-south-1.amazonaws.com/1665056275154_vkOaAo4WNZhCAj9gsTsWTzFM90BxmD8_WV-SLZPIZDCbsko522awKC7t5vd3EBKO_00pl8G3pBQ22bO6Ei6vDOcqWXjRasImNPXC.jpg';
                        let nftName = mData[0]?.sName ? mData[0].sName : '-';
                        let nftPrice = row.nBidPrice ? row.nBidPrice : '-';
                        let nftStatus = mData[0]?.bStatus
                            ? mData[0].bStatus
                            : '-';
                        let nftSaleType = row.eBidStatus ? row.eBidStatus : '-';
                        return `<button type="button" onclick="setNftData($(this))" oNftImage="${nftImage}" nNFTChainId="${nChainId}" sNftName="${nftName}" nNftPrice="${nftPrice}" bNftStatus="${nftStatus}" sNftSaleType="${nftSaleType}" class="eye-btn" style="border:none; background:white;"><i class="fa fa-eye" style="font-size:20px; "></i></button>`;
                    },
                },
            ],
            columnDefs: [
                {
                    searchable: true,
                    orderable: true,
                },
            ],
            iDisplayLength: 10,
        });
    });
});

async function setNftData(btn) {
    let chainId = btn.attr('nNFTChainId');
    let currencySymbol = _chains_web3[chainId].nativeCurrency.symbol;
    $('#nftImage').prop('src', btn.attr('oNftImage'));
    $('#nftName').text(btn.attr('sNftName'));
    $('#nftPrice').text(btn.attr('nNftPrice') + ' ' + currencySymbol);
    $('#nftStatus').text(btn.attr('bNftStatus'));
    $('#nftSaleType').text(btn.attr('sNftSaleType'));
}

$('#transactionTable').on('click', '.eye-btn', function (e) {
    // $('.nft-details-modal-otr').show();
    $('.nft-details-modal-otr').modal('show');
    $('body').css('overflow', 'hidden');
    e.stopPropagation();
});
$('.nft-details-modal-otr .close-icn').on('click', function (e) {
    // $(this).parent().hide();
    $('.nft-details-modal-otr').modal('hide');
    $('body').css('overflow', 'hidden auto');

    e.preventDefault();
});
$(document).on('click', function () {
    $('.nft-details-modal-otr').hide();
});
$('.nft-details-modal').on('click', function (e) {
    e.stopPropagation();
});

// datatable alert disable
if ($.fn.dataTable) $.fn.dataTable.ext.errMode = 'none';
