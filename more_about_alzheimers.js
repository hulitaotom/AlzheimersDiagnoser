var accessToken = "6757d9b8794e4a0aa3bc0645b849f88d";
var baseUrl = "https://api.api.ai/v1/";
var mySessionId = 666;
var onetime=true;
var eventCount=0;
var start_flag = false;
var recognition;
var userAge=localStorage.age;
var response = [" Alzheimer’s disease is a progressive, degenerative brain disease and the most common form of dementia, a group of brain disorders that affect a person’s memory, thinking and ability to interact socially. \n At present, we don’t know what causes Alzheimer’s disease. We do know that people with this illness have abnormal material that builds up in their brain. These protein ‘tangles’ and ‘plaques’ disrupt communication between brain cells and lead to eventual cell death and brain shrinkage. There is currently no cure for Alzheimer’s disease. Available treatments only target symptoms, not the underlying biological cause of the disease. \n We are conducting research into the role of inflammation in Alzheimer’s disease in order to find potential targets for therapeutic intervention. We are also studying how Alzheimer’s disease affects the brain and body early in the disease, with the aim of developing a diagnostic test. Through our research on healthy ageing, we are working with Indigenous communities to increase our knowledge about ageing and dementia in Australian Aboriginal people living in urban areas.", 
             " Women are disproportionately affected by Alzheimer’s disease (AD). Nearly two-thirds of the more than 5 million Americans living with Alzheimer’s are women and two-thirds of the more than 15 million Americans providing care and support for someone with Alzheimer’s disease are women. This devastating disease places an unbalanced burden on women at work and at home, forcing them to make difficult choices about their careers, their relationships and  their futures. \n As real a concern as breast cancer is to women’s health, women in their 60s are about twice as likely to develop AD over the rest of their lives as they are to develop breast cancer. \n So why does this disease seem to affect more women than men? At first glance, the answer may be that women generally live longer than men, making them more likely to reach the ages of greater risk. However, there is emerging evidence that suggests there may be unique biological reasons for these differences beyond longevity alone. These biological underpinnings may contribute to the underlying brain changes, progression and symptom manifestation in Alzheimer’s disease. \n Early-onset Alzheimer's is an uncommon form of dementia that strikes people younger than age 65. Of all the people who have Alzheimer's disease, about 5 percent develop symptoms before age 65. So if 4 million Americans have Alzheimer's, at least 200,000 people have the early-onset form of the disease.",
             "From age 18 years to age 70 years the normal score is 47/50 From age 70 years to age 80 years the normal score is 46/50 Over the age of 80 years the normal score is 45/50",
             "The average score for patients with mild AD 60/100.\nThe average score for patients with moderate AD on the TYM is 50/100.\nPatients with mild cognitive impairment (MCI) – organic memory problems which may or may not progress to Alzheimer’s disease may score much better. An average score for the best MCIs is 80/100 with particular problems with recall of the learnt sentence",
             
           ];



$(document).ready(function() {
    $('#example').html("Does Alzheimer's disease depend on age?\
    Does Alzheimer's disease depend on gender?\
    What is Alzheimer's disease?\
    What is the possibility of getting Alzheimer's disease at my age?\
    What is the average scores of patients with Alzheimer's disease?\
    Can I use the test as a screening test?\
    Can I use the test as a diagnostic test?\
    What is a normal test score?");
    
    if (onetime){
        setImg("1");
        document.getElementById("age").style.display='none';
    getData("age");
    //userAge = parseInt($("#age").val());
    setResponse("WWelcome back! Please feel free to ask me any questions you want, I will try my best to answer!");
    onetime=false;
    }
    
    

   $("#input").keypress(function(event) {
       
       //event.which == 13 is the event when we press the enter!
        if (event.which == 13) {
            event.preventDefault();
            send();   
            $("#input").val("");//added by TOM
            setImg("1");
        }
        
   });

    // the speak function using here!
   $("#rec").click(function(event) {
       setImg("1");
        switchRecognition();
   });

    // to start the whole test
});

function getData(val){
  $.ajax( { url: "https://api.mlab.com/api/1/databases/tom/collections/" + val + "?apiKey=Ddyladj4Ce5nXw5avRUL0woi_cbHq1pk"}
    ).done(function(data){
        var output ="";
        $.each(data,function(key,data){output+=data.data;});     
        $('#'+val).html(output);

    })
}

function setImg(val){
      document.getElementById('img').src=val+".png";

}

// the send function
function send() {
    var text = $("#input").val();
    $.ajax({
           
           type: "POST",
           
           url: baseUrl + "query?v=20150910",
           
           contentType: "application/json; charset=utf-8",
           
           dataType: "json",
           
           headers: {
                "Authorization": "Bearer " + accessToken
           },
           
           data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
           
           success: function(myResponse) {
                setResponse(JSON.stringify(myResponse.result.fulfillment.speech, undefined, 2));
           },
           
           error: function() {
                setResponse("Internal Server Error");
           }
    });
    //setResponse("Loading...");
}



function setResponse(val) {
    var val1=val;
    val=val.substring(1, val.length-1);
    if(val=="Here is some information about the Alzheimer's at your age.")
    {setImg("5");
      if(userAge < 50)
        $("#response").html("According to a research by the Alzheimer's Association, the proportion of people under 50 with Alzheimer's disease is less than 1%");
      else if(userAge >= 50 && userAge <= 65)
        $("#response").html("According to a research by the Alzheimer's Association, the proportion of people from 50 to 65 with Alzheimer's disease is around 3%");
      else if(userAge > 65 && userAge <=85)
        $("#response").html("According to a research by the Alzheimer's Association, the proportion of people from 65 to 85 with Alzheimer's disease is around 10%");
      else if(userAge > 85)
        $("#response").html("According to a research by the Alzheimer's Association, the proportion of people older than 85 with Alzheimer's disease is more than 25%");
      else
        $("#response").html("wrong");
    }
    else if(val=="Alzheimer's disease is related with both age and gender. Here is what you may want to see.")
    {setImg("5");
      $("#response").html(response[1]);
    }
    else if(val=="Here is some additional information about Alzheimer's disease.")
    {setImg("5");
      $("#response").html(response[0]);
    }
    else if (val1=="WWelcome back! Please feel free to ask me any questions you want, I will try my best to answer!"){
        $("#response").html(val);
        setImg("1");
    }else if (val=="Here are some average scores for different age ranges."){
        $("#response").html(response[2]);
    }else if(val=="Usually around 40 to 60. Please take a look at the information below for details."){
        $("#response").html(response[3]);
    }else if(val=="Yes with some caution. A person in whom you have a low suspicion of organic memory problems who scores well on the test is highly unlikely to have AD."){
        $('#response').html("Yes with some caution. A person in whom you have a low suspicion of organic memory problems who scores well on the test is highly unlikely to have AD.");
    }else if(val=="Unfortunately no, a low test score is a sign that a patient needs further assessment but is not a diagnostic test for AD."){
        $('#response').html("Unfortunately no, a low test score is a sign that a patient needs further assessment but is not a diagnostic test for AD.");
    }
    else{
        $("#response").html(val);
        setImg("4");
    }
    //$("#response").text(val);


    

                //synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance('"'+val);
    utterThis.lang = "en-US";
    
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

// set the image file


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