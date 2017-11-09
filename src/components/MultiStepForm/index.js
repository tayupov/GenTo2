import React, { Component } from 'react';

class MultiStepForm extends Component {

    componentWillMount() {
        (function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm", b="https://embed.typeform.com/"; if(!gi.call(d,id)) { js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })()
    }

    render() {
        return (
            <div>
            <div class="typeform-widget" data-url="https://theo3519.typeform.com/to/HUl3AH" style={{ width: '100%', height: '500px' }}> 
            </div> 
            <div style={{fontFamily: 'Sans-Serif', fontSize: '12px', color: '#FFF', opacity: '0.5', paddingTop: '5px'}}>
                powered by <a href="https://www.typeform.com//?utm_campaign=HUl3AH&amp;utm_source=typeform.com-11129968-Basic&amp;utm_medium=typeform&amp;utm_content=typeform-embedded-poweredbytypeform&amp;utm_term=EN" style={{ color: '#FFF' }} target="_blank">Typeform</a> 
            </div>
        </div>
        )
    }
}

export default MultiStepForm;