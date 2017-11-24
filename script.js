var accessToken = "8d84cbf5c8774dc999a3a72610de2797";
var baseUrl = "https://api.api.ai/v1/";
var mySessionId = 123456;
var events=["Picture_Recognition_1","Other_Type2","Picture_Recognition_2",
            "Memory_Test","Math_1","Other_Type3",
            "Math_2","Memory_Test_Ans","Picture_Recognition_3",
            "Math_3","Other_Type1","Test-Evaluation"];
var hint=["This is a kind of mountain.", "Humm, the president is not Clinton.", "This is a tool often used to collect liquid.",
            "Just read out the sentence and try to memory, we will ask you to repeat the sentence later.", "1 nickel is 5 cents.",
            "For example, red.", "Do a subtraction.", "The sentence begins with 'Good'.", "This is a kind of fruit.",
            "Just tell me the sum of 5 and 6.", "For example, US dollar.", "Please click the buttom to proceed."];
            
var eventCount=0;
var start_flag = false;
var recognition;

// type of task sending
var Type_Enum = {
    PURE_TEXT: 1,
    GREETING : 2,
    TEST:3,
}

//score counter
var PICTURE_SCORE = 0;
var MEMORY_SCORE = 0;
var MATH_SCORE = 0;
var OTHER_SCORE = 0;

$(document).ready(function() {
  document.getElementById("check").style.display='none';
   $("#input").keypress(function(event) {

       //event.which == 13 is the event when we press the enter!
        if (event.which == 13) {
            event.preventDefault();
            send();   
            $("#input").val("");//added by TOM
        }
   });

    // the speak function using here!
   $("#rec").click(function(event) {
        switchRecognition();
   });

    // to start the whole test
   $("#start").click(function(event){
      $("#input").val("");
        welcome0="Hello! I am Test-Bot.";
        //welcome1= "Welcome to the ultimate online Alzheimer's test!"; 
        //welcome2= "Before we start the test, I would like to first collect some of your personal information.";
        //welcometext="Hello! I am Test-Bot. Welcome to the ultimate online Alzheimer's test! Before we start the test, I would like to first collect some of your personal information.";
      $("#response").text(welcome0);
        var utterThis = new SpeechSynthesisUtterance('"'+welcome0);
        utterThis.lang = "en-US";
        speechSynthesis.speak(utterThis);

        //var utterThis = new SpeechSynthesisUtterance('"'+welcome1);
        //utterThis.lang = "en-US";
        //speechSynthesis.speak(utterThis);

        //var utterThis = new SpeechSynthesisUtterance('"'+welcome2);
        //utterThis.lang = "en-US";
         resetAPIai();  
        //speechSynthesis.speak(utterThis);
         // to reset the contexts
        start_flag=false; // not start the test yet.
        eventCount=0;
        document.getElementById('img').src="1"+".png";
       

    
        
        
   });

   $("#check").click(function(event){
        window.location.href = "index1.html";
   });
});

// the send function
function send(){
    if (start_flag === false){
        // first do the greeting test here
        sendTask($("#input").val(),"",Type_Enum.GREETING);
        //switchRecognition();
    }
        //begin the test here!    
    else{
        sendTask($("#input").val(),"",Type_Enum.TEST);
        //switchRecognition();
    }
}

// function to reset APIai here
function resetAPIai(){
    $.ajax({
        
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        
        //POST body
        data: JSON.stringify({
            query:"I wannna start!", 
            lang: "en", 
            sessionId: mySessionId.toString(),
            resetContexts: true
        }),
        
        success: function() {
            sendTask("start","test-bot",Type_Enum.PURE_TEXT);
            //setResponse("PPlease Wait..");
        },
        
        error: function() {
        }
    });
    //setResponse("Loading...");
}

// the query we send here, the task it is doing depends on the TYPE
function sendTask(inputValue,someCont, TYPE) {
    $.ajax({
        
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        
        data: JSON.stringify({ query: inputValue, 
                    lang: "en", 
                    contexts:[{'name': someCont, 'lifespan' : 99}], 
                    sessionId: mySessionId.toString()}),
        //the "data" here is one of the elements sent to the server
        
        // to check the test here!
        success: function(myResponse) {

            switch(TYPE){
                
                // when sending pure_text, just set the response
                case Type_Enum.PURE_TEXT:
                    sendRawData($("#input").val());
                    setResponse(JSON.stringify(myResponse.result.fulfillment.speech));
                    //setResponse(JSON.stringify(myResponse, undefined, 2));

                    break;
                
                // when sending greetings, call the greeting function
                case Type_Enum.GREETING:
                    Greeting(myResponse);
                    sendRawData($("#input").val());
                    break;
                
                // during the test, update event counter and then send pure text
                case Type_Enum.TEST:
                     updateCounter(myResponse);

                     sendTask(events[eventCount],
                            events[eventCount],
                            Type_Enum.PURE_TEXT);
                     setImg();
                    break;
            }
            //switchRecognition();

        },
        
        error: function() {
         setResponse("Internal Server Error");
        }
    });
    //setResponse("Loading...");
}


function sendData(data,key){
  $.ajax( { url: "https://api.mlab.com/api/1/databases/tom/collections/"+key+"?apiKey=Ddyladj4Ce5nXw5avRUL0woi_cbHq1pk",
      data: JSON.stringify( { "data" : data } ),
      type: "PUT",
      contentType: "application/json" } );

}

function sendRawData(data){
  $.ajax( { url: "https://api.mlab.com/api/1/databases/tom/collections/raw?apiKey=Ddyladj4Ce5nXw5avRUL0woi_cbHq1pk",
      data: JSON.stringify( { "data" : data } ),
      type: "POST",
      contentType: "application/json" } );

}

function setResponse(val) {
    val=val.substring(1, val.length-1);
    $("#response").text(val);

                //synth = window.speechSynthesis;
                var utterThis = new SpeechSynthesisUtterance('"'+val);
                utterThis.lang = "en-US";
                
                utterThis.onend = function () {
                  if (eventCount!=11){
                    switchRecognition();
                  }      
              };
                speechSynthesis.speak(utterThis);

}

// to check the answer by whether it returns a null.
function checkAns(ans){
    if(ans === ""){
        return false;
    }else{
        return true;
    }
}

// update the counter.
function updateCounter(answer){
    
    if(answer.result.fulfillment.speech == "user ask to repeat")
    {
      return;
    }
    if (answer.result.fulfillment.speech === "Okay, no problem, let's continue."){
        setResponse("OOkay, no problem, let's continue.");
    }
    if (answer.result.fulfillment.speech === "OK, no problem."){
        setResponse("OOK, no problem. Here it is.");
        eventCount=eventCount-1;
        return;
    }
    if (answer.result.fulfillment.speech === "hint"){
        setResponse("OOK, but to ensure a better result accuracy, I can only  give you one. Here it is."+hint[eventCount]);
        return;
    }
    if(checkAns(answer.result.parameters.ans)){
        if((eventCount===0)||(eventCount===2)||(eventCount===8)){
            PICTURE_SCORE = PICTURE_SCORE + 1;
        }
        
        if((eventCount===1)||(eventCount===5)||(eventCount===10)){
            OTHER_SCORE = OTHER_SCORE + 1;
        }
        
        if((eventCount===4)||(eventCount===6)||(eventCount===9)){
            MATH_SCORE = MATH_SCORE + 1;
        }
        
        if(eventCount===7){
            MEMORY_SCORE = 1;
        }
    }
    
    eventCount=eventCount+1;
        if (eventCount==11){//THIS NUMBER HERE CORRESPONDS TO THE "TEST EVALUATION" INTENT, CHACK AND UPDATE LATER
          sendData(PICTURE_SCORE,"pic");
          sendData(MATH_SCORE,"math");
          sendData(MEMORY_SCORE,"mem");
          sendData(OTHER_SCORE,"com");
          sendData(PICTURE_SCORE+MATH_SCORE+OTHER_SCORE+MEMORY_SCORE,"total_correct");
          sendData(10-(PICTURE_SCORE+MATH_SCORE+OTHER_SCORE+MEMORY_SCORE),"total_wrong");
          sendData((PICTURE_SCORE+MATH_SCORE+OTHER_SCORE+MEMORY_SCORE)*10,"score");
          document.getElementById("check").style.display='block';
          document.getElementById('img').src="3"+".png";
        }

}

// set the image file
function setImg(){
  if (eventCount==0||eventCount==2||eventCount==8){
    document.getElementById("pic").style.display='block';
      document.getElementById('pic').src=events[eventCount]+".png";
  }else{
    document.getElementById("pic").style.display='none';
  }
}

// the response when doing greeting.
function Greeting(myResponse){
    if(myResponse.result.fulfillment.speech === "test-bot-end"){
        start_flag = true;      
        document.getElementById('img').src="2"+".png";  
        sendData(myResponse.result.parameters.user_name, "name");
        sendData(myResponse.result.parameters.user_age, "age");
        localStorage.setItem("age", myResponse.result.parameters.user_age);
        if(myResponse.result.parameters.user_gender==="Mr."){
          sendData("Male", "gender");
        }else if(myResponse.result.parameters.user_gender==="Ms."){
          sendData("Female", "gender");
        }else{
          sendData("Unknown", "gender");
        }
        sendTask(events[eventCount],events[eventCount],Type_Enum.PURE_TEXT);
        setImg();
    }
    
    else{
        setResponse(JSON.stringify(myResponse.result.fulfillment.speech));
        //setResponse(JSON.stringify(myResponse, undefined, 2));
    }
}

function startRecognition() {
      recognition = new webkitSpeechRecognition();
      recognition.onstart = function(event) {
        updateRec();
      };
      recognition.onresult = function(event) {
        var text = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setInput(text);
        stopRecognition();
      };
      recognition.onend = function() {
        stopRecognition();
      };
      recognition.lang = "en-US";
      recognition.start();
    }
  
    function stopRecognition() {
      if (recognition) {
        recognition.stop();
        recognition = null;
      }
      updateRec();
    }
    function switchRecognition() {
      if (recognition) {
        stopRecognition();
      } else {
        startRecognition();
      }
    }
    function setInput(text) {
      $("#input").val(text);
      send();
    }
    function updateRec() {
      $("#rec").text(recognition ? "Stop" : "Speak");
}