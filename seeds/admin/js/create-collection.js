'use-strict';

$('#create-collection').on('click', createCollection);
async function createCollection() {
    let sName = $('#txt-colleciton-name').val().trim();
    let sDescription = $('#txt-collection-description').val().trim();
    let filePath = $('#fileInputColl')[0].files[0];

    if (!filePath) {
        $('#uploadAreaColl').addClass('err-dashed');
        notify('error', 'invalid image');
        return;
    }
    if (!sName) {
        $('#txt-colleciton-name').addClass('err-solid');
        notify('error', 'invalid collection name');

        return;
    }
    if (!_validator.isValidStringName(sName)) {
        $('#txt-colleciton-name').addClass('err-solid');
        notify('error', 'invalid collection name');
    }
    if (!sDescription) {
        $('#txt-collection-description').addClass('err-solid');
        notify('error', 'invalid description');
        return;
    }
    let oData = new FormData();
    oData.append('collectionImg', filePath);
    oData.append('sCollName', sName);
    oData.append('sDescription', sDescription);

    $('#create-collection').attr('disabled', true);
    $('#cancel').attr('disabled', true);
    $('#create-collection').text('');
    $('#create-collection').append(
        `<i class="fa fa-spinner fa-spin"></i> In process`
    );

    const oHeader = {
        authorization: sTokenAdmin,
    };
    try {
        await _helper.call_API(
            'POST',
            '/collection/create-collection',
            oData,
            oHeader
        );
        notify('success', 'Request for new collection generated');
        $('#create-collection-modal').hide();

        // allCollectionsCache.push(data);

        // refreshCollectionDropdown();
        // setTimeout(function () {
        //     location.reload();
        // }, 1500);
    } catch (error) {
        console.log(error);
        notify('error', error);
        $('#create-collection').attr('disabled', false);
        $('#cancel').attr('disabled', false);
        $('#create-collection').text('Create');
        $('.overlay').remove();
    }
}

$('#txt-colleciton-name, #txt-collection-description').on(
    'keypress',
    function () {
        $(this).removeClass('err-solid');
    }
);

// upload area

const uploadAreaColl = document.querySelector('#uploadAreaColl');
const dropZoonColl = document.querySelector('#dropZoonColl');
const loadingTextColl = document.querySelector('#loadingTextColl');
const fileInputColl = document.querySelector('#fileInputColl');
const previewImageColl = document.querySelector('#previewImageColl');
const fileDetailsColl = document.querySelector('#fileDetailsColl');
const uploadedFileColl = document.querySelector('#uploadedFileColl');
const uploadedFileInfoColl = document.querySelector('#uploadedFileInfoColl');
const uploadedFileNameColl = document.querySelector(
    '#uploadAreaColl .uploaded-file__name'
);
const uploadedFileIconTextColl = document.querySelector(
    '#uploadAreaColl .uploaded-file__icon-text'
);
const uploadedFileCounterColl = document.querySelector(
    '#uploadAreaColl .uploaded-file__counter'
);
const toolTipDataColl = document.querySelector(
    '#uploadAreaColl .upload-area__tooltip-data'
);
const imagesTypesColl = ['jpeg', 'webp', 'png', 'svg', 'gif'];

toolTipDataColl.innerHTML = [...imagesTypesColl].join(', .');

dropZoonColl.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZoonColl.classList.add('drop-zoon--over');
});

dropZoonColl.addEventListener('dragleave', function (event) {
    dropZoonColl.classList.remove('drop-zoon--over');
});

dropZoonColl.addEventListener('drop', function (event) {
    event.preventDefault();

    dropZoonColl.classList.remove('drop-zoon--over');
    const file = event.dataTransfer.files[0];

    uploadFileColl(file);
});

dropZoonColl.addEventListener('click', function (event) {
    fileInputColl.click();
});

fileInputColl.addEventListener('change', function (event) {
    const file = event.target.files[0];
    uploadFileColl(file);
});

function uploadFileColl(file) {
    const fileReader = new FileReader();
    const fileType = file.type;
    const fileSize = file.size;

    if (fileValidateColl(fileType, fileSize)) {
        dropZoonColl.classList.add('drop-zoon--Uploaded');

        loadingTextColl.style.display = 'block';
        previewImageColl.style.display = 'none';
        uploadedFileColl.classList.remove('uploaded-file--open');
        uploadedFileInfoColl.classList.remove('uploaded-file__info--active');

        fileReader.addEventListener('load', function () {
            setTimeout(function () {
                uploadAreaColl.classList.add('upload-area--open');
                loadingTextColl.style.display = 'none';
                previewImageColl.style.display = 'block';

                fileDetailsColl.classList.add('file-details--open');
                uploadedFileColl.classList.add('uploaded-file--open');
                uploadedFileInfoColl.classList.add(
                    'uploaded-file__info--active'
                );
            }, 500);

            previewImageColl.setAttribute('src', fileReader.result);
            uploadedFileNameColl.innerHTML = file.name;
            $('#uploadAreaColl').removeClass('err-dashed');
            progressMoveColl();
        });

        fileReader.readAsDataURL(file);
    } else {
        this;
    }
}

function progressMoveColl() {
    let counter = 0;
    setTimeout(() => {
        let counterIncrease = setInterval(() => {
            if (counter === 100) {
                clearInterval(counterIncrease);
            } else {
                counter = counter + 10;
                uploadedFileCounterColl.innerHTML = `${counter}%`;
            }
        }, 100);
    }, 600);
}

function fileValidateColl(fileType, fileSize) {
    let isImage = imagesTypesColl.filter(
        (type) => fileType.indexOf(`image/${type}`) !== -1
    );
    if (isImage[0] === 'jpeg') {
        uploadedFileIconTextColl.innerHTML = 'jpg';
    } else {
        uploadedFileIconTextColl.innerHTML = isImage[0];
    }

    if (isImage.length !== 0) {
        if (fileSize <= 15 * 1024 * 1024) {
            return true;
        } else {
            return notify(
                'error',
                'Please Your File Should be 15 Megabytes or Less'
            );
        }
    } else {
        return notify('error', 'Please make sure to upload An Image File Type');
    }
}

$(document).ready(function () {
    $('#dropZoonColl').change(function () {
        $('#uploadAreaColl .drop-zoon__icon').addClass('upload-active');
        $('#uploadAreaColl .drop-zoon__paragraph').addClass('upload-active');
    });
});
