// Copyright (c) 2002-2003 Quadralay Corporation.  All rights reserved.
//

function  WWSeeAlso_Object()
{
  this.mbClickedLink = false;

  this.fOnClickButton = WWSeeAlso_OnClickButton;
  this.fOnClickLink   = WWSeeAlso_OnClickLink;
}

function  WWSeeAlso_OnClickButton(ParamSeeAlsoObjectID)
{
  if ( ! this.mbClickedLink)
  {
    setTimeout("document.SeeAlso_" + ParamSeeAlsoObjectID + ".Click();", 1);
  }

  this.mbClickedLink = false;
}

function  WWSeeAlso_OnClickLink()
{
  this.mbClickedLink = true;
}
