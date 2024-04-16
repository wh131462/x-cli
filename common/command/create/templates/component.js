export const componentHTML = `
<!-- @NAME -->
`;
export const componentSCSS = `
@import "styles/variables/public.scss"
`;
export const componentTS = `

@Component({
    selector:"@PREFIX-@NAME"，
    templateUrl:"./@NAME.component,html",
    styleUrls:["./@NAME.component.scss"],
    standalone:true,
    imports:[CommonModule,FormsModule]
})
export class @NAMEComponent extends BaseComponent{
    
}
`;
