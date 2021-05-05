// function slidebar-btn
document.querySelector('.slidebar-btn').addEventListener('click',() => {
    document.querySelector('.wrapper').classList.toggle('collapse-slide');
});

// Zoom image

var ImageContainModal = document.querySelectorAll(".post-img");
var ImageModalSelect = null;
var ImageModal = null;
var ImageShow = document.querySelector(".modal-box-img");
var index = 0;
var scrollTop = document.querySelector(".scroll-to-top");


function updateMedia(index){
    let ImageClone = ImageModal[index].cloneNode() || "";
    ImageShow.innerHTML = "";
    ImageShow.appendChild(ImageClone);
}

ImageContainModal.forEach(function(el, idx){
    el.addEventListener("click", function(){
        modalImage.classList.add("active");

        ImageModalSelect = this;
        ImageModal = this.querySelectorAll(".post-media>*");
        index = 0;

        updateMedia(index);
        console.log("Clicked");
    });    
});


// Scroll Top
window.addEventListener("scroll", () => {
    if(window.pageYOffset > 0){
        scrollTop.classList.add("active");
    }else {
        scrollTop.classList.remove("active");
    }
});

scrollTop.addEventListener("click", () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});
//AJAX


$(document).ready(function(){
    var skip = 0;
    show(skip);
    $("#btn_send").click(()=>{
    
    let formdata = new FormData();
    const noidungbaiviet = $('#noidungbaiviet').val();
    formdata.append('noidungbaiviet',noidungbaiviet);
    var photoPost = $("#inputImgPost")[0].files[0];
    formdata.append('photoPost',photoPost);
    
    if(noidungbaiviet==''){
        alert("Vui lòng nhập nội dung!!!")
    }
    else{
            $.ajax({
                url:'/baiviet',
                type:'POST',
                data:formdata,
                contentType: false,
                processData: false,
                success:(res)=>{
                    $("#noidungbaiviet").val('');
                },
                error:(e)=>{
                    alert("Error!")
                    console.log("ERROR: ", e);
                }
                })

        }
    })
    
    
    
    function show(skip){
        $.ajax({
            url:'/scrollbaiviet',
            type:'POST',
            data:{
                skip:skip
            },
            success:(result)=>{
            //pass data from ajax to display handlebars
            var source  = $('#greeting-template').html();
            var template = Handlebars.compile(source);
            //handlebars registerhelper
            Handlebars.registerHelper("xif", function(var1,operator,var2,options) {
                switch(operator){
                    case '==':
                        return (var1 == var2) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (var1 != var2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
                });
            var html_content = template(result);
            
            $('#html_display').append(html_content); 

            },
            error:(e)=>{
                alert("Error!")
                console.log("ERROR: ", e);
            }
        })
    }
    postCmt();
    delCmt();
    delPost();

    // function togget class
        $('#html_display').on('click','.list-select',(e)=>{   
            let pid = e.target.getAttribute('data-pid')
            $('.menu-select-1'+pid).toggleClass('appear');   
        })
        $('#html_display').on('click','.list-select-comment',(e)=>{   
            let cid = e.target.getAttribute('data-cid')
            $('.menu-select-2'+cid).toggleClass('appear');   
        })
        

    function postCmt(){
        $("#html_display").on('click','.inputCmt',(event)=>{
            var idPost = event.target.getAttribute('data-id');
            var cmt = $('#'+idPost).val();
            if(cmt==''){
                alert('Vui lòng nhập nội dung muốn bình luận!!!')
            }
            else{
                $.ajax({
                    url:'/comment',
                    type:'POST',
                    data:{idPost,cmt},
                    success:(res)=>{
                            $('#'+idPost).val('');
                            
                            $('.'+res.idPost).append(`
                            <div class="post-comment-box d-flex flex-wrap pt-3 delCmt${res._id}">
                                            <div class="post-user-img user-img">
                                                <img class="border-radius" src="/uploads/${res.imageUserCmt}" alt="Image of User">
                                            </div>
                                            <div class="post-comment-contain w-75 flex-grow-1 pt-3 pt-md-0 mr-3">
                                                <div class="form-group post-comment-content p-3 overflow-hidden mb-0">
                                                <div class="list-select-comment"><i data-cid="${res._id}" class="fa fa-ellipsis-h"></i></div>
                                                <div class="menu-select-comment-btn shadow menu-select-2${res._id}">
                                                    <li><button data-idcmt="${res._id}" data-toggle="modal" data-target="#confirmDelCmt">Delete</button></li>
                                                    <li><button data-idcmt="${res._id}" data-toggle="modal" data-target="#EditCmt">Edit</button></li>
                                                </div>
                                                <div class="post-comment-author">
                                                        <a href="#" class="post-comment-author-name color-black">${res.nameUserCmt}</a>
                                                        <span class="post-comment-author-time d-md-inline-block d-block mx-md-2">${res.createdCmt}</span>
                                                    </div>
                                                    <p id="binhluan${res._id}"  class="post-comment-text mt-3">${res.cmt}</p>
                                                </div>
                                            </div>
                                        </div>
                            `)
                    },
                    error:(e)=>{
                            alert("Error comment!!!");
                            console.log(e)
                    }
                })
            }
            })
    }

    function delPost(){
        var idDelPost;
        $('#confirmDelPost').on('show.bs.modal', function (event) {
            let button = $(event.relatedTarget) 
            idDelPost = button.data('idpost') 
        })
            
        $('#confirmDel').click(()=>{
            $.ajax({
                url:'/baiviet',
                type:'DELETE',
                data:{idDelPost},
                success:(res)=>{
                    $('#confirmDelPost').modal('hide');
                    $('.delPost'+res.idDelPost).remove();
                },
                error:(e)=>{
                    alert("Error delete post!!!");
                    console.log(e)
                }
            })
        })
        
    }
    
    function delCmt(){
        var idDelCmt;
        $('#confirmDelCmt').on('show.bs.modal', function (event) {
            let button = $(event.relatedTarget) 
            idDelCmt = button.data('idcmt') 
        })
        
        $('#DelCmt').click(()=>{
            $.ajax({
                url:'/comment',
                type:'DELETE',
                data:{idDelCmt},
                success:(res)=>{
                    $('#confirmDelCmt').modal('hide');
                    $('.delCmt'+res.idDelCmt).remove();
                },
                error:(e)=>{
                    alert("Error delete cmt!!!");
                    console.log(e)
                }
            })
        })
    }
    

    //edit bai viet
    var idEditPost;
    $('#EditPost').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) 
        idEditPost = button.data('idpost')
        $.ajax({
            url:'/baiviet/'+idEditPost,
            type:'GET',
            success:(res)=>{
                $('#ndbv').val(res.post.noidungbaiviet)   
            },
            error:(e)=>{
                alert("Error get detail post!!!");
                console.log(e)
            }
        }) 
        $('#editpost').click(()=>{
            
            let formdata = new FormData();
            let noidungbaiviet = $('#ndbv').val();
            formdata.append('noidungbaiviet',noidungbaiviet);
            var photoPost = $("#imgPost")[0].files[0];
            formdata.append('photoPost',photoPost);

            $.ajax({
                url:'/baiviet/'+idEditPost,
                type:'PUT',
                data:formdata,
                contentType: false,
                processData: false,
                success:(res)=>{
                    $('#EditPost').modal('hide');
                    
                    $('#noidung'+res.idPost).html(res.noidungbaiviet)
                    $('#img'+res.idPost).attr('src','/uploads/'+res.photoPost)
                },
                error:(e)=>{
                    alert("Error edit post!!!");
                    console.log(e)
                }
            })
        })
    })
    //edit binh luận
    var idEditCmt;
    $('#EditCmt').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) 
        idEditCmt = button.data('idcmt')
        $.ajax({
            url:'/comment/'+idEditCmt,
            type:'GET',
            success:(getresult)=>{
                $('#ndcmt').val(getresult.cmt.cmt)   
            },
            error:(e)=>{
                alert("Error get detail cmt!!!");
                console.log(e)
            }
        })
        $('#editcmt').click(()=>{
            let cmt = $('#ndcmt').val();
            $.ajax({
                url:'/comment/'+idEditCmt,
                type:'PUT',
                data:{cmt},
                success:(res)=>{
                    $('#EditCmt').modal('hide');
                    $('#binhluan'+res.idCmt).html(res.cmt)
                    
                },
                error:(e)=>{
                    alert("Error edit cmt!!!");
                    console.log(e)
                }
            })
        })
    })
    //scroll to load more data from database
    var url = document.URL.split('/')[3];
    if(url !='announce'){

        $(window).scroll(function(){
            if($(window).scrollTop()>=$(document).height()-$(window).height()-100){
                skip =skip+10;
                show(skip)
            }
        })
    }

});



//AJAX get announce 

$(document).ready(function(){
    //function get data Announce
    function getAnnounce(next,select){
        $.ajax({
            url:'/announce/getdataAnounce',
            type:'POST',
            data:{
                next:next,
                select:select
            },
            success:(result)=>{
            //pass data from ajax to display handlebars
            var source  = $('#greeting-template-announce').html();
            var template = Handlebars.compile(source);
            //handlebars registerhelper
            Handlebars.registerHelper("xif", function(var1,operator,var2,options) {
                switch(operator){
                    case '==':
                        return (var1 == var2) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (var1 != var2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            });
            var html_content = template(result);
            
            $('#html_display_announce').html(html_content); 

            },
            error:(e)=>{
                alert("Error!")
                console.log("ERROR: ", e);
            }
        })
    }
    //next là number để next page, select để biết người dùng tìm then phòng nào
    var next =0;
    let select;
    getAnnounce(next,select);
    $('.clickNextPage').click((e)=>{
    
        next+=10;
        getAnnounce(next,select)
        $('#scrollAnnounce').click();
    })
    $('.clickPrePage').click((e)=>{
        
        if(next<10){
            getAnnounce(next,select)
        }
        else{
            next-=10;
            getAnnounce(next,select)
            $('#scrollAnnounce').click();
        }
    })

    //model del announce
    let idDelAnnounce;
    $('#delAnnounce').on('show.bs.modal', function (event) {

        let button = $(event.relatedTarget) 
        idDelAnnounce = button.data('iddel')
        var formDel = document.forms['form__hidden'];
        $('#confirmDelAnnounce').click(()=>{
            formDel.action ='/announce/'+idDelAnnounce+'?_method=DELETE';
            formDel.submit();
        })

    })

    //function change selete option
    function changeAnnounce(){
        $('#inputGroupSelectDonVi').change(()=>{
            select = $('#inputGroupSelectDonVi').val();
            getAnnounce(next,select)
        })
    }
    changeAnnounce()
})

//socket io
$(document).ready(function(){
    const socket = io();

    socket.on('sever-emit',function(data){
        $('#seversendmess').html(data)
        $('#seversendmess_class').toggleClass("d-block");
        setTimeout(()=>{
            $('#seversendmess_class').toggleClass("d-block");
        },3000)
        
    })

    if($('.socketsign').length>0){
       var nameUser  = $('#name_user').html()

        socket.emit('thongbao',nameUser)
    }
})