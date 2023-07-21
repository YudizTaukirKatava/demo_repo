$(() => {
    $('#categoriesTable').DataTable({
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: _helper.getDataTableAJAX('POST', '/admin/getCategories'),
        aoColumns: [
            {
                mData: 'sName',
            },
            {
                mData: 'sName',
                orderable: false,
                render: function (mData, type, row) {
                    if (row.isDefault == true) {
                        return `<td>--</td>`;
                    }
                    return `<button type="button" onclick="editCategory($(this))" title="Edit" category="${row._id}" categoryName="${mData}" class="btn btn-info btn-xs"><i class="fa fa-edit"></i></button>`;
                },
            },
            {
                mData: 'sName',
                orderable: false,
                render: function (mData, type, row) {
                    if (row.isDefault == true) {
                        return `<td>--</td>`;
                    }
                    if (row.sStatus == 'Active')
                        return `<button type="button" onclick="toggleStatus($(this))" name="Deactivated" title="Deactivate" category="${row._id}" class="btn btn-danger btn-xs"><i class="fa fa-ban"></i></button>`;
                    else
                        return `<button type="button" onclick="toggleStatus($(this))" name="Active" title="Activate" category="${row._id}" class="btn btn-success btn-xs"><i class="fa fa-check"></i></button>`;
                },
            },
            {
                mData: 'sName',
                orderable: false,
                render: function (mData, type, row) {
                    if (row.isDefault == true) {
                        return `<td>--</td>`;
                    }
                    return `<button type="button" onclick="deleteCategory($(this))" title="Delete" category="${row._id}" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>`;
                },
            },
        ],
    });
});

async function deleteCategory(btn) {
    let sTokenAdmin = localStorage.getItem('AuthorizationAdmin');

    console.log(btn.attr('category'));
    let sUserId = btn.attr('category');

    try {
        let res = await _helper.call_API(
            'DELETE',
            '/admin/deleteCategory',
            { sUserId },
            { Authorization: sTokenAdmin }
        );
        if (!res) {
            notify('error', 'not deleted');
            return;
        }
        notify('success', 'category deleted');
        $('#categoriesTable').DataTable().ajax.reload();
        return;
    } catch (error) {
        notify('error', 'category not deleted');

        return;
    }
}

async function toggleStatus(btn) {
    let sUserId = btn.attr('category');

    const oData = {
        sStatus: btn.attr('name'),
        sUserId,
    };
    try {
        let res = await _helper.call_API(
            'PATCH',
            '/admin/toggleCategory',
            oData,
            { Authorization: sTokenAdmin }
        );
        if (!res) {
            notify('error', 'status not updated');
            return;
        }
        $('#categoriesTable').DataTable().ajax.reload(null, false);
        notify('success', `status updated to ${oData.sStatus}`);

        return;
    } catch (error) {
        notify('error', 'status not updated');
        return;
    }
}

function editCategory(btn) {
    console.log(btn.attr('category'));

    $('#modelTitle').text('Update Category');
    $('#btnSubmitCategory').text('Update');
    $('#categoryName').val(btn.attr('categoryName'));
    $('#btnSubmitCategory').attr('sUserId', btn.attr('category'));
    $('#lblCategoryName').removeClass('d-flex');
    $('#lblCategoryName').addClass('d-none');

    $('#categoryModel').modal({
        show: true,
    });
}

$('#btnSubmitCategory').on('click', async () => {
    const reCategory = /^[a-zA-Z](( )?[a-zA-Z]+)*$/;
    if ($('#categoryName').val().trim() == '') {
        $('#lblCategoryName').text('Please Fill up this field');
        $('#lblCategoryName').removeClass('d-none');
        $('#lblCategoryName').addClass('d-flex');
        return;
    } else if (!reCategory.test($('#categoryName').val().trim())) {
        $('#lblCategoryName').text('Invalid Category');
        $('#lblCategoryName').removeClass('d-none');
        $('#lblCategoryName').addClass('d-flex');
        return;
    } else if (!_validator.isValidStringName($('#categoryName').val().trim())) {
        $('#lblCategoryName').text('Invalid Category Name');
        $('#lblCategoryName').removeClass('d-none');
        $('#lblCategoryName').addClass('d-flex');
        return;
    } else {
        $('#lblCategoryName').removeClass('d-flex');
        $('#lblCategoryName').addClass('d-none');
    }
    // Update Category
    console.log($('#btnSubmitCategory').text());
    if ($('#btnSubmitCategory').text() == 'Update') {
        console.log('Update');
        console.log('New: ' + $('#categoryName').val().trim());
        const oData = {
            sUserId: $('#btnSubmitCategory').attr('sUserId'),
            sNewName: $('#categoryName').val().trim(),
        };
        console.log(oData);
        try {
            let res = await _helper.call_API(
                'PATCH',
                '/admin/editCategory',
                oData,
                {
                    Authorization: sTokenAdmin,
                }
            );
            console.log('res : ', res);
            if (!res) {
                notify('error', 'category is not added');
                return;
            }
            $('#categoryModel').modal('hide');
            $('#categoriesTable').DataTable().ajax.reload(null, false);
            notify('success', 'category updated');
            return;
        } catch (error) {
            notify('error', 'category not updated');
            return;
        }
    } else if ($('#btnSubmitCategory').text() == 'Add') {
        console.log('inside Add');
        const oData = {
            sName: $('#categoryName').val().trim(),
        };
        try {
            let res = await _helper.call_API(
                'POST',
                '/admin/addCategory',
                oData,
                {
                    Authorization: sTokenAdmin,
                }
            );
            console.log(res);
            if (!res) {
                notify('error', 'category not added');
                return;
            }
            notify('success', 'category added');
            $('#categoriesTable').DataTable().ajax.reload();

            $('#categoryModel').modal('hide');
            return;
        } catch (error) {
            notify('error', error);
        }
    }
});

$('#btnAddNewCategory').on('click', () => {
    $('#modelTitle').text('Add New Category');
    $('#btnSubmitCategory').text('Add');
    $('#btnSubmitCategory').attr('oldCategory', '');
    $('#categoryName').val('');
    $('#lblCategoryName').removeClass('d-flex');
    $('#lblCategoryName').addClass('d-none');

    $('#categoryModel').modal({
        show: true,
    });
});

// datatable alert disable
if ($.fn.dataTable) $.fn.dataTable.ext.errMode = 'none';
