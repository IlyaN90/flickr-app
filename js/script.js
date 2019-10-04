let currentPage=1;
let currentPic=0;
searchString='';
let imgArray=[]; 
let groupArray=[];
let globalCount='';
function changePagesListener(){
    if( document.querySelector('#prev')!=null){
    document.querySelector('#prev').addEventListener('click', async()=>{
        if(currentPage>1){
            addGroups(groupArray, searchString);
            currentPic=0;
            currentPage--;
            let images=await getImages(searchString);
            updateUI(images);
        }
    })
}
    if( document.querySelector('#next')!=null){
    document.querySelector('#next').addEventListener('click', async()=>{
        addGroups(groupArray, searchString);
        currentPic=0;
        currentPage++;
        let images=await getImages(searchString);
        if(currentPage<images.photos.pages){
        updateUI(images);
        }
    })
 }
}

function changePicListener(){
   // removeEventListener('click', querySelector('#prev'));
    document.querySelector('#prevPic').addEventListener('click', async()=>{
        if(currentPic>0){
            currentPic--;
            addGroups(groupArray, searchString);
            updateUI(splitUrl(imgArray[currentPic]),'zoomIn');
        }
    })
    document.querySelector('.leftAside').addEventListener('click', async()=>{
        if(currentPic>0){
            currentPic--;
            addGroups(groupArray, searchString);
            updateUI(splitUrl(imgArray[currentPic]),'zoomIn');
        }
    })
    document.querySelector('.rightAsise').addEventListener('click', async()=>{
        if(currentPic<11){
            currentPic++;
            addGroups(groupArray, searchString);
            updateUI(splitUrl(imgArray[currentPic]),'zoomIn');
        }
    })    
    document.querySelector('img').addEventListener('click', async()=>{
        let images=await getImages(searchString);
        addGroups(groupArray, searchString);
        clickedImgListner();
        updateUI(images);
    })
    document.querySelector('#nextPic').addEventListener('click', async()=>{
        if(currentPic<11){
        addGroups(groupArray, searchString);
        currentPic++;
        updateUI(splitUrl(imgArray[currentPic]),'zoomIn');
    }
        })
 }

function clickedImgListner(){ 
   document.querySelector('main').addEventListener('click', async(e)=>{
    if(imgArray.indexOf(e.target)>=0){
       currentPic=imgArray.indexOf(e.target);
                let data= splitUrl(imgArray[currentPic]);
                addGroups(groupArray, searchString);
                updateUI(data, 'zoomIn');
            }   
    }, false);  
}

document.querySelector('.submit').addEventListener('click', async(e)=>{
    e.preventDefault();
    if(document.querySelector('.searchinput').value!=0){
    searchString= document.querySelector('.searchinput').value;
    let groups=await getGroups(searchString);
    if(groups!=null){
        groupArray=groups;
        addGroups(groupArray, searchString);
      //  let groupinfo = await groupDesc(groupArray);
       // matchDesription(groupinfo);
        
     }
    let images=await getImages(searchString);
    clickedImgListner();
    updateUI(images);
}
})

function searchRessurected(){
    document.querySelector('.submit').addEventListener('click', async(e)=>{
        e.preventDefault();
        if(document.querySelector('.searchinput').value!=0){
            currentPage=0;
            currentPic=0;
        searchString= document.querySelector('.searchinput').value;
        let groups=await getGroups(searchString);
        addGroups(groups, searchString);
        let images=await getImages(searchString);
        clickedImgListner();
        updateUI(images);}
    })
}
//listeners ^
function splitUrl(img){
    let thumbUrl=img.src;
    let arr = thumbUrl.split('/');
    let httpAndFarm=arr[2].split('.');
    let farm=httpAndFarm[0];
    let server=arr[3];
    let idAndSecretStr=arr[4].split('_');
    let imgId = idAndSecretStr[0];
    let imgSecret = idAndSecretStr[1];
    let imgSize='b';
     let data = {
        farm: farm,
        server:server,
        id:imgId,
        secret:imgSecret,
        imgSize: imgSize,
        title:img.title
    };
    return data;
}

/*function matchDesription(groupID){
    let groupsBaseUrl='https://api.flickr.com/services/rest/';    
    const apiKey='2af54aca22ccb9c902078adc64b47907';
    let groupsGroupsMethod='flickr.groups.getInfo';
    let urlGroups=`${groupsBaseUrl}?method=${groupsGroupsMethod}&api_key=${apiKey}&group_id=${groupId}&format=json&nojsoncallback=1`;
    try{
    let resp=  await fetch(urlGroups);
    let data1= await resp.json();
        return data1;
       } 
       catch(err){
           console.error("hej groupmembers");
       }
}*/

/*async function groupDesc(data){
    let data1=[];
    //console.log(data);
    //let groups=[];
    //let urlGroups=[];
    let i=0;
    data.groups.group.forEach(arr=>{     
        let newOne={
            id: arr.nsid,
            desc:'' 
        }
        let descobj= matchDesription(arr.nsid)
        newOne.desc=descobj
        data1[i]=newOne;
        
        i++;
    })
console.log(data1);
}*/


//fetch groups
async function getGroups(searchString){
        const apiKey='2af54aca22ccb9c902078adc64b47907';
        let groupsCount=12;
        let groupsBaseUrl='https://api.flickr.com/services/rest/';    
        let groupsGroupsMethod='flickr.groups.search';
        let urlGroups=`${groupsBaseUrl}?method=${groupsGroupsMethod}&api_key=${apiKey}&text=${searchString}&per_page=${groupsCount}&format=json&nojsoncallback=1`;
        try{
            let resp= await fetch(urlGroups);
            let data= await resp.json();
            return await data;
        }
        catch(err){
            console.error("hej groups");
        }   
}
//fetch images
async function getImages(searchString){
    const apiKey='2af54aca22ccb9c902078adc64b47907';
    const urlFormat='json&nojsoncallback=1';
    let method='flickr.photos.search';
    if(document.querySelector(`select`)!=null){
        let imgCount=document.querySelector(`select`).value;
        globalCount=imgCount;
    }
    const baseUrl='https://api.flickr.com/services/rest';
    let url=`${baseUrl}?api_key=${apiKey}&method=${method}&text=${searchString}&page=${currentPage}&format=${urlFormat}&per_page=${globalCount}`;
    try{
        let resp= await fetch(url);
        let data= await resp.json();
        return await data;
    }
    catch(err){
        console.error("hej");
    }   
}
//lägger in groupnamn i footer
function addGroups(data, searchString){
    groupArray=data;
    let footer=document.querySelector('footer');
    footer.innerHTML=`<p class='name'>${searchString} groups on flickr:</p>`;
    data.groups.group.forEach(i=>{
         groupname=i.name;
         p=document.createElement('p');
         p.innerHTML=
             `<section class='groups'>${groupname}</section>`;
         footer.appendChild(p);
    })
}

function createZoomInSection(data,main, nav){
        //main.removeChild(sect);
        sect2 = document.createElement('section');      //skapar ZoomIn section
        sect2.setAttribute('class','zoomIn-section');
        sect2.setAttribute('id','zoomIn-section-id');
        main.appendChild(sect2);
        let el = document.createElement('img');         //skapar large img elementet
        el.setAttribute('class','large-img');
        el.setAttribute('src', imgUrl(data,'large'));
        el.setAttribute('data-title',imgArray[currentPic].getAttribute('data-title'));
        let imgTitle =el.getAttribute('data-title');      //hämtar title från large img
        nav.innerHTML=                                     //skapar upper nav med rätta knappar
        `<button id="prevPic">Previous</button>
        <p class="title">${imgTitle}</p>
        <button id="nextPic">Next</button>`;
        let elcontainer = document.createElement('figure'); //skapar "behållare" för knappar runt bilden
        elcontainer.setAttribute('class','active-img');
        sect2.appendChild(elcontainer);
        let leftAside=document.createElement('nav');        //läger in knapparna i varsin nav 
        leftAside.setAttribute('class','leftAside');
        let rightAsise=document.createElement('nav');
        rightAsise.setAttribute('class','rightAsise');
        leftAside.innerHTML=`<button class="leftAsideButton"><</button>
        `;
        rightAsise.innerHTML=`<button class="rightAsise">></button>
        `;
        elcontainer.appendChild(leftAside);                
        elcontainer.appendChild(el);
        elcontainer.appendChild(rightAsise);
        changePicListener();
        let slider=document.createElement('nav');       //skapar slider nav med 5 bilder 
        slider.setAttribute('class','slider');
        sect2.appendChild(slider);
        let firstPic=currentPic-2;
        let lastPic=currentPic+3;
        if(currentPic<2){
            firstPic=0;
            lastPic=5;
        }
        if(currentPic>8){
            firstPic=7;
            lastPic=12;
        }
        //addGroups(groupArray);                  //adds footer


        let sixPicArray = imgArray.slice(firstPic, lastPic);        //creates slider
        sixPicArray.forEach(img=>{
            document.createElement('img');
            let imgData=splitUrl(img);
            if(data.id==imgData.id){
                img.setAttribute('class','small-img active');
            }
            else{
                img.setAttribute('class','small-img')
            }
            document.querySelector('.slider').appendChild(img); 
        //s<p class="title">${imgTitle}</p>
            //set attribues på bilden
        })
}

function createGridSection(data, main, nav){
    nav.innerHTML=                                      //startar listner för den
    `<button id="prev">Previous Page</button>
    <form>
    <select id="selector" class="selector" name="imagesperpage">
        <option value=16>16</option>
        <option value=20>20</option>
        <option value=24>24</option>
    </select>
    <input class='searchinput' id="searchinputagain" type="text" name="search">
    <input type="submit" id='submitagain' class='submit'>
</form>
    <button id="next">Next Page</button>`;
    searchRessurected();                                    
    let sect = document.createElement('section');
    sect.setAttribute('class','grid-section');
    main.appendChild(sect);                             //lägger till grid-section
        imgArray=[];
        data.photos.photo.forEach(img => {
            if(img.farm>0){
                let el = document.createElement('img');
                el.setAttribute('src', imgUrl(img, 'thumb')); 
                if(img.title==''){
                    img.title='Title is missing';
                }
                el.setAttribute('data-title',img.title);
                imgArray.push(el);
                el.setAttribute('class',`small-img`);
                document.querySelector('section').appendChild(el);
            }
        });
        changePagesListener();
}
//skapar antingen grid eller zoomin sections
function updateUI(data,order="grid"){
    let main=document.querySelector('main');            
    main.innerHTML='';                                  //tömmer main
    let nav=document.querySelector('.upperNav');        //targetar uppernav
    nav.innerHTML='';                    
    let footer=document.querySelector('footer');        //skapar footer   
    addGroups(groupArray, searchString); 
    if(order=='zoomIn'){                      //ständer av change page listener
       createZoomInSection(data,main,nav);
    }
    if(order=='grid'){                                  //creates grid section
        createGridSection(data, main, nav);
    }
}

function imgUrl(img,size){
    let imgSize='z';
    let url='';
    if (size == 'thumb'){
        imgSize='q'
        url=`https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_${imgSize}.jpg`
    }
    else if(size == 'large'){
        url=`https://${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_${img.imgSize}.jpg`
    }
    return url;
}


