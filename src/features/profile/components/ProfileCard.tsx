import { UserEntity } from "@/shared/domain/user/userEntity";
import {
  BookmarksSimpleIcon,
  ChatCircleIcon,
  Icon,
  NotePencilIcon,
  RepeatIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

interface EngagementListProps {
  Icon: Icon;
  text: string;
  counter: number;
}

const EngagementList = (props: EngagementListProps) => {
  const { Icon, counter, text } = props;

  return (
    <div className="w-full flex flex-col justify-center items-center gap-0">
      <div className=" flex justify-center items-center gap-0">
        <Icon size={32} weight="fill" />
        <h3 className="w-full text-sm text-center">{counter}</h3>
      </div>
      <p className="text-xs">{text}</p>
    </div>
  );
};

interface EngagementProps {
  user: UserEntity;
}

const Engagement = (props: EngagementProps) => {
  const { user } = props;

  return (
    <div className="w-full flex justify-center items-center gap-2">
      <EngagementList
        Icon={NotePencilIcon}
        counter={user?.posts?.length || 0}
        text="Posts"
      />
      <EngagementList
        Icon={ThumbsUpIcon}
        counter={user?.likes?.length || 0}
        text="Likes"
      />
      <EngagementList
        Icon={ChatCircleIcon}
        counter={user?.comments?.length || 0}
        text="Comments"
      />
      <EngagementList
        Icon={RepeatIcon}
        counter={user?.reposts?.length || 0}
        text="Reposts"
      />
      <EngagementList
        Icon={BookmarksSimpleIcon}
        counter={user?.bookmarks?.length || 0}
        text="Bookmarks"
      />
    </div>
  );
};

interface ProfileCardProps {
  user: UserEntity;
}

const ProfileCard = (props: ProfileCardProps) => {
  const { user } = props;

  return (
    <div className="w-full flex flex-col justify-center items-center bg-primary text-text rounded-md p-4 gap-4">
      <div className="w-full flex flex-col justify-center items-center">
        <Image
          src={
            user?.pictureUrl
              ? user.pictureUrl.includes("public")
                ? "/api" + user.pictureUrl
                : "/image" + user.pictureUrl
              : "/default-profile-picture.png"
          }
          alt="user-profile-picture"
          width={2000}
          height={2000}
          className="w-36 aspect-square rounded-full object-fill border-4 border-text mb-2"
        />
        <h3 className="w-full text-center text-lg font-semibold">
          {user?.fullname}
        </h3>
        <p className="w-full text-center text-sm ">@{user?.username}</p>
      </div>
      <Engagement user={user} />
    </div>
  );
};

export default ProfileCard;
