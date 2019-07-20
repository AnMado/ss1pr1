$(document).ready(function(){
   $('ul').on('click','li',function (event) {
       $(event.target).animate({
           "opacity":0,
           "right":"100%",
       },500,function(){
           $(this).remove();
       });


   });
   $('#add p').click(function(){
       var name = $('#name').val();
       var cost = $('#cost').val();
       if (name && cost){
           var el = $('<li>'+ name + ' - ' + cost + 'р </li>');
           $('ul').append(el);
       }
       else{
           alert("Неправильное добавление товара!");
       }
   });
});