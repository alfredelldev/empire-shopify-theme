import{f as m,H as p,J as x,K as N,j as s,e as h,b,L as R,T as L}from"./Error.js";var j=m(function(o,e){var r;const a=p("FormLabel",o),t=x(o),{className:v,children:n,requiredIndicator:c=s.jsx(_,{}),optionalIndicator:u=null,...d}=t,i=N(),l=(r=i==null?void 0:i.getLabelProps(d,e))!=null?r:{ref:e,...d};return s.jsxs(h.label,{...l,className:b("chakra-form__label",t.className),__css:{display:"block",textAlign:"start",...a},children:[n,i!=null&&i.isRequired?c:u]})});j.displayName="FormLabel";var _=m(function(o,e){const r=N(),a=R();if(!(r!=null&&r.isRequired))return null;const t=b("chakra-form__required-indicator",o.className);return s.jsx(h.span,{...r==null?void 0:r.getRequiredIndicatorProps(o,e),__css:a.requiredIndicator,className:t})});_.displayName="RequiredIndicator";var F=m(function(o,e){const{borderLeftWidth:r,borderBottomWidth:a,borderTopWidth:t,borderRightWidth:v,borderWidth:n,borderStyle:c,borderColor:u,...d}=p("Divider",o),{className:i,orientation:l="horizontal",__css:y,...g}=x(o),q={vertical:{borderLeftWidth:r||v||n||"1px",height:"100%"},horizontal:{borderBottomWidth:a||t||n||"1px",width:"100%"}};return s.jsx(h.hr,{ref:e,"aria-orientation":l,...g,__css:{...d,border:"0",borderColor:u,borderStyle:c,...q[l],...y},className:b("chakra-divider",i)})});F.displayName="Divider";function W(){return s.jsx(L,{color:"blackAlpha.500",children:"No configuration found for this product."})}export{F as D,j as F,W as N};