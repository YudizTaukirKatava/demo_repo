$(() => {
    $('#collectionTable').DataTable({
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: _helper.getDataTableAJAX('POST', '/admin/getCollection'),
        aoColumns: [
            {
                mData: 'sName',
            },
            {
                mData: 'sName',
                orderable: false,
                render: function (mData, type, row) {
                    return `<button type="button" onclick="editCollection($(this))" title="Edit" collectionId="${row._id}" collection="${mData}" description="${row.sDescription}" imgUrl="${row.sImageUrl}" class="btn btn-info btn-xs"><i class="fa fa-edit"></i></button>`;
                },
            },
            {
                mData: 'sName',
                orderable: false,
                render: function (mData, type, row) {
                    if (row.isDefault == true) {
                        return `<td>Default</td>`;
                    }
                    return `<button type="button" onclick="deleteCollection($(this))" title="Delete" collection="${row._id}" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>`;
                },
            },
        ],
    });
});

async function deleteCollection(btn) {
    let sUserId = btn.attr('collection');

    try {
        let oRes = await _helper.call_API(
            'DELETE',
            '/admin/deleteCollection',
            { sUserId },
            { Authorization: sTokenAdmin }
        );
        if (!oRes) {
            notify('error', 'not deleted');
            return;
        }
        notify('success', 'collection deleted');
        $('#collectionTable').DataTable().ajax.reload();
        return;
    } catch (error) {
        notify('error', error);

        return;
    }
}

function editCollection(btn) {
    $('#modelTitle').text('Update Collection');
    $('#btnSubmitCollection').text('Update');
    $('#btnSubmitCollection').attr('sCollectionId', btn.attr('collectionId'));
    $('#collectionName').val(btn.attr('collection'));
    $('#collectionDesc').val(btn.attr('description'));

    //     .html(`<img src=" ${btn.attr(
    //     'imgUrl'
    // )}" alt="Girl in a jacket" width="100%" height="100%">
    // `);
    $('#collection-modal-image').addClass('js--no-default');
    $('#collection-modal-image').attr(
        'style',
        `background-image: url(${btn.attr('imgUrl')})`
    );
    $('#lblCollectionName').removeClass('d-flex');
    $('#lblCollectionName').addClass('d-none');

    $('#collectionModel').modal({
        show: true,
    });
}

$('#btnSubmitCollection').on('click', async () => {
    const reCollection = /^[a-zA-Z](( )?[a-zA-Z]+)*$/;
    if ($('#collectionName').val().trim() == '') {
        $('#lblCollectionName').text('Please Fill up this field');
        $('#lblCollectionName').removeClass('d-none');
        $('#lblCollectionName').addClass('d-flex');
        return;
    } else if (!reCollection.test($('#collectionName').val().trim())) {
        $('#lblCollectionName').text('Invalid Collection');
        $('#lblCollectionName').removeClass('d-none');
        $('#lblCollectionName').addClass('d-flex');
        return;
    } else if (
        !_validator.isValidStringName($('#collectionName').val().trim())
    ) {
        $('#lblCollectionName').text('invalid collection name');
        $('#lblCollectionName').removeClass('d-none');
        $('#lblCollectionName').addClass('d-flex');
        return;
    } else {
        $('#lblCollectionName').removeClass('d-flex');
        $('#lblCollectionName').addClass('d-none');
    }

    var fd = new FormData();

    var files = $('#collectionImage')[0].files;
    fd.append('collectionImg', files[0]);
    fd.append('sDescription', $('#collectionDesc').val().trim());

    if ($('#btnSubmitCollection').text() == 'Update') {
        fd.append('sNewName', $('#collectionName').val().trim());
        fd.append(
            'sCollectionId',
            $('#btnSubmitCollection').attr('sCollectionId')
        );
        try {
            let res = await _helper.call_API(
                'PATCH',
                '/admin/edit-collection',
                fd,
                {
                    Authorization: sTokenAdmin,
                }
            );
            $('#collectionModel').modal('hide');
            $('#collectionTable').DataTable().ajax.reload(null, false);
            notify('success', 'collection Updated');
            return;
        } catch (error) {
            console.log(error);
            notify('error', error);
            return;
        }
    } else if ($('#btnSubmitCollection').text() == 'Add') {
        fd.append('sCollName', $('#collectionName').val().trim());
        fd.append('eStatus', 'Accepted');

        try {
            let res = await _helper.call_API(
                'POST',
                '/admin/create-collection',
                fd,
                {
                    Authorization: localStorage.getItem('AuthorizationAdmin'),
                }
            );

            $('#collectionModel').modal('hide');
            $('#collectionTable').DataTable().ajax.reload();
            notify('success', 'collection Added');
            return;
        } catch (error) {
            console.log(error);
            notify('error', error);
            return;
        }
    }
});

$('#btnAddNewCollection').on('click', () => {
    $('#modelTitle').text('Add New Collection');

    $('#btnSubmitCollection').text('Add');
    $('#btnSubmitCollection').attr('oldCollection', '');

    $('#collectionName').val('');
    $('#collectionDesc').val('');

    $('#collection-modal-image').removeClass('js--no-default');
    $('#collection-modal-image').removeAttr('style');
    $('#lblCollectionName').removeClass('d-flex');
    $('#lblCollectionName').addClass('d-none');

    $('#collectionModel').modal({
        show: true,
    });
});

// datatable alert disable
if ($.fn.dataTable) $.fn.dataTable.ext.errMode = 'none';
