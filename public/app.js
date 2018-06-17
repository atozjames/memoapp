var auth,database,userInfo,selectedKey;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBcwDFRBH3HzSP5neXbEiOh7Y8YRycoEF8",
  authDomain: "memowebapp-6b71b.firebaseapp.com",
  databaseURL: "https://memowebapp-6b71b.firebaseio.com",
  projectId: "memowebapp-6b71b",
  storageBucket: "memowebapp-6b71b.appspot.com",
  messagingSenderId: "291380243618"
};
firebase.initializeApp(config);

auth = firebase.auth();
database = firebase.database();

var authProvider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged(function(user){
if( user ){
    console.log("onAuth 호출");
    userInfo = user
    get_memo_list();
} else {
  
  auth.signInWithPopup(authProvider);
}

})


function get_memo_list(){

var memoRef = database.ref('memos/'+userInfo.uid);
memoRef.on('child_added', on_child_added);
memoRef.on('child_changed',function(data){
  console.log(data);
  var key = data.key;
  var txt = data.val().txt;
  //console.log(key);
  //console.log(data.val().txt);
  var title = txt.substr(0, txt.indexOf('\n'));

  $("#"+key+" > .title").text(title);
  $("#"+key+" > .txt").text(txt);

});
}

function on_child_added(data){
console.log("메모 리스트");

var key = data.key;
var memoData = data.val();

var txt = memoData.txt;

var title =txt.substr(0, txt.indexOf('\n'));
var firstTxt = txt.substr(0,1);

var html = 
    "<li id ='"+key + "' class = \"collection-item avatar\" onclick = \"fn_get_data_one(this.id);\">" +
    "<i class = \"material-icons cicle red\">"+firstTxt + "</i>" +
    "<span class = \"title\">" + title + "</span> <br> <p class = \"txt\">" + txt + "</p>" +
    "<a href = \"#!\" onClick = \"fn_delete_data('" +key+ "') \"class=\"secondary-content\"><i class =\" material-icons\"> grade </a>"+
    "</li>";

    $(".collection").append(html);
}


function save_data(){
   console.log("called save_data");

    var memoRef = database.ref('memos/'+userInfo.uid);
    var txt =  $(".textarea").val();

    if (txt == ''){
      rerurn
    }

    if( selectedKey ) {
      memoRef = database.ref('memos/'+userInfo.uid+'/'+ selectedKey );
      memoRef.update({
        txt : txt,
        createDate : new Date().getTime(),
        updateDate : new Date().getTime(),

      });

    }else{

      memoRef.push({
      txt : txt,
      createDate : new Date().getTime()
    });


    }

    initmemo();
}


function fn_get_data_one(key){
  selectedKey = key;

  var memoRef = database.ref('memos/'+userInfo.uid+'/'+key)
  .once('value').then(
    function(snapshot){
      console.log(snapshot.val().txt)
      $(".textarea").val(snapshot.val().txt);
    },
    function(error){
      console.log(error);
    }
  )};

function fn_delete_data(key){

  if(! confirm(' 삭제하시겠습니까?')){
    return;
  }


  var memoRef = database.ref('memos/'+userInfo.uid+'/'+key);
  memoRef.remove();
  $("#"+key).remove();


}  

  function initmemo(){

    $(".textarea").val("");
    selectedKey = null;
  }


$(function(){

  $(".textarea").blur(function(){
    console.log("call save_data");
    save_data();
  })

})    
