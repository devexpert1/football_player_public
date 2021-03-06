import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera} from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {NotiService } from '../services/noti/noti.service';
import {config} from '../config'
import { Events, ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import { RequestFieldComponent } from "../request-field/request-field.component";
import { RequestfieldmodalComponent } from "../requestfieldmodal/requestfieldmodal.component";
declare var window: any; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalController} from '@ionic/angular'

@Component({
  selector: 'app-requestformatch',
  templateUrl: './requestformatch.page.html',
  styleUrls: ['./requestformatch.page.scss'],
})
export class RequestformatchPage implements OnInit {
  title='Request field';
  updatedata:FormGroup;
  errors:any=['',' ',null,undefined,'null','undefined'];
  timerequired:any=false;
  is_submit:any=false;
  response:any;
  owner_id:any;
  _id:any;
  isActive:any;
  date:any;
  amount:any;
  payment_id:any;
  stime:any;
  etime:any;
  constructor(private modalController: ModalController,
    public formBuilder: FormBuilder,	
    public apiservice:ApiService,
    public notifi:NotiService,

    public ActivatedRoute:ActivatedRoute
     ) {
      this.date= new Date().toISOString();
      this.makeform();
      this.owner_id= this.ActivatedRoute.snapshot.paramMap.get('owner_id')
      this._id= localStorage.getItem('_id');
     
}

makeform(){
  this.updatedata= this.formBuilder.group({
       fullday:[false],
       date:['',Validators.compose([Validators.required])],
       stime:[null],
       etime:[null],
       comment:['',Validators.compose([Validators.required])],

  });
}

  ngOnInit() {}


  async presentModal() {

    if(this.updatedata.value.fullday){

      this.amount=120;
    }else{

      this.amount=10;
    }
    const modal = await this.modalController.create({
      component: RequestfieldmodalComponent,
      componentProps: {
       'owner_id':this.owner_id,
       'player_id':this._id,
       'amount':this.amount,
       'stime':this.stime,
       'etime':this.etime,
       'date': this.updatedata.value.date.split('T')[0]

      }
    });

    modal.onDidDismiss().then((detail) => {
      console.log(detail)
       if(detail.data.status==1){
         this.payment_id= detail.data.payment_id;
         this.sendrequest();
       }
 
     });
    return await modal.present();
  }

  sendrequest(){

    this.is_submit=true;
    this.notifi.presentLoading();
    var data={
                owner_id:this.owner_id,
                _id:this._id,
                fullday:this.updatedata.value.fullday,
                date:this.updatedata.value.date.split('T')[0],
                time:this.updatedata.value.time,
                comment:this.updatedata.value.comment ,
                payment_id:this.payment_id,
                stime:this.stime,
                etime:this.etime,         
              }

   this.apiservice.post('fieldRequest',data,'').subscribe((result) => {  
     this.notifi.stopLoading();              
     this.response=result;
     console.log(this.response)
     if(this.response.status==1){
       this.is_submit=false;
       this.updatedata.reset();
       this.notifi.presentToast('Request sent','success');
     }else{
       this.notifi.presentToast('Internal server error','danger');
     }

},
err => {
     this.notifi.stopLoading();
     this.notifi.presentToast('Error while updating profile  ,Please try later','danger');
});
   console.log(this.updatedata.value);
   this.timerequired=false;

  }



  checkForm(){
    console.log(this.updatedata.value.date.split('T')[0]);
    this.is_submit=true;
    if(this.updatedata.valid){


     var sdate = new Date(this.updatedata.value.stime);
        var edate = new Date(this.updatedata.value.etime);
        let shour:any = sdate.getHours();
        let smin:any = sdate.getMinutes();
        let ehour:any = edate.getHours();
        let emin:any = edate.getMinutes();

        if(shour.toString().length<2){
          shour = '0'+shour;
        }

        if(smin.toString().length<2){
           smin= '0'+smin;
        }

        if(ehour.toString().length<2){
          ehour= '0'+ehour;
        }

        if(emin.toString().length<2){
          emin= '0'+emin;
        }

        this.stime= shour+ ':'+smin;
        this.etime= ehour+':'+emin;

    
      //
    if(this.updatedata.value.fullday==true){
      this.timerequired=false;
      this.presentModal();  


    }else{

       if(this.updatedata.value.stime==null || this.updatedata.value.etime==null){
        this.timerequired=true; 
       }else{
          this.timerequired=false;
        this.presentModal();    
        } 

    }
      
    }
  }
}
