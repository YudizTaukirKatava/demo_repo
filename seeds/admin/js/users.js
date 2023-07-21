$(document).ready(function () {
    console.log('Ready...!');
    $('#userTable').DataTable({
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: _helper.getDataTableAJAX('POST', '/admin/users'),
        aoColumns: [
            {
                mData: 'sUserName',
                render: function (mData, type, row) {
                    return `<td>${
                        mData == undefined || mData == '' ? '-' : mData
                    }</td>`;
                },
            },
            {
                mData: 'sWalletAddress',
                render: function (mData, type, row) {
                    var firstFive = mData.slice(0, 10);
                    var lastFive = mData.slice(mData.length - 8, mData.length);
                    return `<td>${firstFive}...${lastFive}</td>`;
                },
            },
            {
                mData: 'sStatus',
                render: function (mData, type, row) {
                    return `<td>${
                        mData == undefined || mData == '' ? '-' : mData
                    }</td>`;
                },
            },
            {
                mData: 'sStatus',
                orderable: false,
                render: function (data, type, row, meta) {
                    if (data == 'active') {
                        return `
                            <button id="btnBlockUser" name="blocked" title="Block" onclick="toggleStatus($(this))" userId='${row._id}' class="btn btn-danger btn-xs"><i class="fa fa-ban"></i></button>
                            <button id="btnBlockUser" name="deactivated" title="Deactivate" onclick="toggleStatus($(this))" userId='${row._id}' class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>`;
                    }
                    return `<button id="btnBlockUser" name="active" title="Activate" onclick="toggleStatus($(this))" userId='${row._id}' class="btn btn-success btn-xs"><i class="fa fa-check"></i></button>`;
                },
            },
            {
                mData: 'bVerify',
                orderable: false,
                render: function (data, type, row, meta) {
                    if (data == true) {
                        return `<button name="false" title="UnVerify" onclick="toggleVerifyStatus($(this))" userId='${row._id}' class="btn btn-danger btn-xs"><i class="fa fa-ban"></i></button>`;
                    }
                    return `<button name="true" title="Verify" onclick="toggleVerifyStatus($(this))" userId='${row._id}' class="btn btn-success btn-xs"><i class="fa fa-check"></i></button>`;
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

async function toggleStatus(btn) {
    console.log(btn.attr('userId'));
    console.log(btn.attr('name'));
    // toggleUserStatus

    let oOptions = {
        sUserId: btn.attr('userId'),
        sStatus: btn.attr('name'),
    };

    try {
        let oResponse = await _helper.call_API(
            'POST',
            '/admin/toggleUserStatus',
            oOptions,
            { Authorization: sTokenAdmin }
        );
        console.log(
            'file: users.js ~ line 81 ~ toggleStatus ~ oResponse',
            oResponse
        );
        notify('success', `User status updated to ${oOptions.sStatus}`);
        $('#userTable').DataTable().ajax.reload(null, false);
    } catch (error) {
        notify('error', error);
    }
}

async function toggleVerifyStatus(btn) {
    console.log(btn.attr('userId'));
    console.log(btn.attr('name'));

    let oData = {
        sUserId: btn.attr('userId'),
        bVerify: btn.attr('name'),
    };

    try {
        let oResponse = await _helper.call_API(
            'POST',
            '/admin/toggleVerifyStatus',
            oData,
            { Authorization: sTokenAdmin }
        );
        console.log(
            'file: users.js ~ line 81 ~ toggleVerifyStatus ~ oResponse',
            oResponse
        );
        notify('success', `User verify status updated to ${oData.bVerify}`);
        $('#userTable').DataTable().ajax.reload(null, false);
    } catch (error) {
        notify('error', error);
    }
}
