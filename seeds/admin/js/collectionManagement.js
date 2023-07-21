$(document).ready(function () {
    $('#collectionManage').DataTable({
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: _helper.getDataTableAJAX('POST', '/admin/getPendingCollection'),
        aoColumns: [
            {
                mData: 'sName',
                render: function (mData, type, row) {
                    return `<td>${
                        mData == undefined || mData == '' ? '-' : mData
                    }</td>`;
                },
            },
            {
                mData: 'oUser',
                render: function (mData, type, row) {

                    return `<td>${mData[0].sUserName}</td>`;
                },
            },
            {
                mData: 'sDescription',
                render: function (mData, type, row) {
                    return `<td>${
                        mData == undefined || mData == '' ? '-' : mData
                    }</td>`;
                },
            },
            {
                mData: 'sImageUrl',
                orderable: false,
                render: function (data, type, row, meta) {
                    return `<button onclick="popupCollection($(this))"  nft-hash="${data}" data-toggle="modal" data-target="#CollectionModel" class="btn btn-secondary btn-xs"><i class="fa fa-eye"></i></button>`;
                },
            },
            {
                mData: 'eStatus',
                orderable: false,
                render: function (data, type, row, meta) {
                    if (data == 'Pending') {
                        return `<button id="btnBlockUser" name="Rejected" title="Block" onclick="toggleStatus($(this))" userId='${row?._id}' class="btn btn-danger btn-xs"><i class="fa fa-ban"></i></button>
                        <button id="btnBlockUser" name="Accepted" title="Activate" onclick="toggleStatus($(this))" userId='${row?._id}' class="btn btn-success btn-xs"><i class="fa fa-check"></i></button>`;
                    }
                    if (data == 'Accepted') {
                        return `<td>Accepted</td>`;
                    } else {
                        return `<td>Rejected</td>`;
                    }
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

function popupCollection(btn) {
    $('#collectionImg').attr('src', btn.attr('nft-hash'));
    $('#audioNFTPreview').addClass('d-none');
    $('#imageNFTPreview').removeClass('d-none');
}

async function toggleStatus(btn) {
    let oOptions = {
        sCollectionId: btn.attr('userId'),
        sStatus: btn.attr('name'),
    };

    try {
        await _helper.call_API('PATCH', '/admin/toggleCollection', oOptions, {
            Authorization: sTokenAdmin,
        });
        notify('success', `collection status updated to ${oOptions.eStatus}`);
        $('#collectionManage').DataTable().ajax.reload(null, false);
        return;
    } catch (error) {
        console.log(error);
        notify('error', error, message);
        return;
    }
}
