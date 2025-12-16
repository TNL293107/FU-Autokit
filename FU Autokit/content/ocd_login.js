var enabled;
var campus;
var k;
const loginBtn = document.querySelector('.landing-btn-login');
const campusSelect = document.getElementById('CampusCode');
const main = async () => {
    enabled = await getFromStorage('OCD_1', '');
    k = await getFromStorage('K','')
    const campusVal = await getFromStorage('STUDENT_CAMPUS','');
    switch (campusVal){
        case '0':
            campus = null;
            break;
        case '3':
            campus = 'APHL';
            break;
        case '4':
            campus = 'HCM';
            break;
        case '5':
            campus = 'DN';
            break;
        case '6':
            campus = 'CT';
            break;
        case '7':
            campus = 'QN';
            break;
        default:
            campus = null;
            break;
    }
}
window.addEventListener('load', async (event) => {
    main().then(() => {
        if (enabled == true&&loginBtn&&campusSelect) {
                loginBtn.click();
                campusChange();
                if(campus!=null)
                {
                    if(k)
                    {
                        document.getElementById("feid_login").click();
                    }
                    else{
                        document.getElementById("google_login").click();
                    }
                }
                else{
                    console.log(campus)
                }
        }
    });
});

function campusChange(){
    campusSelect.value = campus;
    campusSelect.dispatchEvent(new Event('change'));
}   