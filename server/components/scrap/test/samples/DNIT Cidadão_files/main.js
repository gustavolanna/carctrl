$(document).ready(function(){
	$("#div-error > ul").addClass("alert alert-error");
	$("#div-success > ul").addClass("alert alert-success");
});




var ajaxRequests = 0;

function blockUI(){
    ajaxRequests++;
    $("#cover").show();
}

function unblockUI(){
    ajaxRequests--;
    if(ajaxRequests < 1){
        $("#cover").hide();
    }
}

function loadCover(){
    var cover = document.createElement('div');
    cover.className = "cover";
    cover.id = "cover";
    
    var imgLoading = document.createElement('img');
    imgLoading.src = "img/loading.gif";
    
    cover.appendChild(imgLoading);
    document.body.appendChild(cover);
}