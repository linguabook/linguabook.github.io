
// warning: this file is auto generated
import React from "react";
import DataCard, { StatelessCard } from "../DataCard";

const DATA = [{source:{type:'visual',name:'Unsplash Pictures',url:'https://unsplash.com/s/photos/encylopedia'},data:{visual:['https://images.unsplash.com/photo-1492539438225-2666b2a98f93?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZW5jeWxvcGVkaWF8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80']}},{source:{type:'universal',name:'Merriam Webster',url:'https://www.merriam-webster.com'},error:new Error('Not Found')},{source:{type:'universal',name:'Macmillan Dictionary',url:'https://www.macmillandictionary.com/dictionary/british/encylopedia'},data:{audio:[],transcription:[],tag:[],definition:[],'in':[],synonym:[]}},{source:{type:'universal',name:'Cambridge Dictionary',url:'https://dictionary.cambridge.org/dictionary/english/encylopedia'},data:{audio:[],transcription:[],tag:[],definition:[],visual:[],'in':[],collocation:[]}},{source:{type:'universal',name:'Cambridge Dictionary',url:'https://dictionary.cambridge.org/dictionary/english-russian/encylopedia'},data:{'translated_as@ru':[]}},{source:{type:'universal',name:'Cambridge Dictionary',url:'https://dictionary.cambridge.org/dictionary/english-french/encylopedia'},data:{'translated_as@fr':[]}},{source:{type:'universal',name:'Cambridge Dictionary',url:'https://dictionary.cambridge.org/dictionary/english-german/encylopedia'},data:{'translated_as@de':[]}},{source:{type:'universal',name:'Urban Dictionary',url:'https://www.urbandictionary.com'},error:new Error('Not Found')},{source:{type:'audio',name:'Forvo',url:'https://forvo.com'},error:new Error('Not Found')},{source:{type:'audio',name:'HowJSay.com',url:'https://howjsay.com/mp3/encylopedia.mp3'},data:{audio:[{url:'https://howjsay.com/mp3/encylopedia.mp3'}]}},{source:{type:'text',name:'Compromise Lexicon',url:'http://compromise.cool/'},data:{tag:[['Noun','Singular']]}}];

const StaticCard = () => {
  const Card = DATA ? StatelessCard : DataCard;
  return <Card text="encylopedia" lang="en" data={DATA}/>;
};

export default StaticCard;
