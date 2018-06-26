import * as React from 'react';
import {MessageBar, MessageBarType, IPersonaProps,  assign,autobind,css, CompactPeoplePicker,
    IBasePickerSuggestionsProps, NormalPeoplePicker, Button, Checkbox, ChoiceGroup, Breadcrumb, ComboBox, DatePicker,
    Dialog, Dropdown, Persona, TextField, Toggle,Tooltip, IContextualMenuItem } from 'office-ui-fabric-react';

export class Repeatable extends React.Component<any,any> {
    public constructor(props) {
        super(props);
        this.state = {  
           repeatedItems: [new Array().concat(this.props.children)]
          }
        //this.onCloseClick = this.onCloseClick.bind(this);
       // this.onSaveClick = this.onSaveClick.bind(this);
    }

    public handleClick(cmd) : void {
        var newItems = this.state.repeatedItems;

         // The list is added to or removed from based on the user controls
         if (cmd == 'inc' && newItems.length < this.props.maxRepeat) {
            newItems.push(new Array().concat(this.props.children));
        } else if (cmd == 'dec' && newItems.length > this.props.minRepeat) {
            newItems.splice(-1,1);
        }

        // The list is updated and the UI re-rendered
        this.setState({
            repeatedItems: newItems          
        });
        //console.log(this.state.repeatedItems);
    };

    public render() {
        var titleRepeat = this.props.titleRepeat;
        // Since the children are an array of elements, loop through twice
        // This is brittle in handling children with nested elements
        return (
            <div>
                {this.state.repeatedItems.map(function(itemGroup, i) {
                    return (
                        <fieldset key={i + 1}>
                            <legend>{titleRepeat}</legend>

                            {itemGroup.map(function(item) {
                                
                                return React.cloneElement(item, {id: item.props.id + '-' + (i + 1)});
                            })}
                        </fieldset>
                    );
                })}

                {/* User controls */}
                <Button onClick={this.handleClick.bind(this, 'dec')} text='Remove' />
                <Button onClick={this.handleClick.bind(this, 'inc')} text='Add' />
            </div>
        );
    }
};


    // Repeatable component
    // var Repeatable = React.createClass({
    //     getInitialState: function() {
    //         // The initial state is a copy of the passed-in children elements
    //         return {
    //             repeatedItems: [new Array().concat(this.props.children)]
    //         };
    //     },
    //     handleClick: function(cmd) {
    //         var newItems = this.state.repeatedItems;
    
    //         // The list is added to or removed from based on the user controls
    //         if (cmd == 'inc' && newItems.length < this.props.maxRepeat) {
    //             newItems.push(new Array().concat(this.props.children));
    //         } else if (cmd == 'dec' && newItems.length > this.props.minRepeat) {
    //             newItems.splice(-1,1);
    //         }
    
    //         // The list is updated and the UI re-rendered
    //         this.setState({
    //             repeatedItems: newItems
    //         });
    //     },
    //     render: function() {
    //         var titleRepeat = this.props.titleRepeat;
    //         // Since the children are an array of elements, loop through twice
    //         // This is brittle in handling children with nested elements
    //         return (
    //             <div>
    //                 {this.state.repeatedItems.map(function(itemGroup, i) {
    //                     return (
    //                         <fieldset key={i + 1}>
    //                             <legend>{titleRepeat}</legend>
    
    //                             {itemGroup.map(function(item) {
    //                                 return React.cloneElement(item, {id: item.props.id + '-' + (i + 1)});
    //                             })}
    //                         </fieldset>
    //                     );
    //                 })}
    
    //                 {/* User controls */}
    //                 <a onClick={this.handleClick.bind(this, 'dec')}>Remove</a>
    //                 <a onClick={this.handleClick.bind(this, 'inc')}>Add</a>
    //             </div>
    //         );
    //     }
    // });