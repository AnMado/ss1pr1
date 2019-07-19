$(document).ready(function(){
   $('ul').on('click','li',function (event) {
       $(event.target).toggle(
           function () {
               $(this).animate({
                    "right" : "-=100px"
               }, 700)
           },
           function () {
               $(this).detach()
           }
               )
           }
       )
   $('#add p').click(function(){
       var name = $('#name').val();
       var cost = $('#cost').val();
       if (name && cost){
           var el = $('<li>'+ name + cost + '</li>');
           $('ul').append(el);
       }
       else{
           alert("Неправильное добавление товара!");
       }
   });
});